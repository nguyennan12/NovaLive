/* eslint-disable no-lonely-if */
import ApiError from '#core/error.response.js'
import { ElasticClient } from '#database/init.elasticsearch.js'
import { validateAndNormalizeAttributes } from '#helpers/attribute.help.js'
import { syncProdcutToEs } from '#helpers/spu.helper.js'
import { updateSubModel } from '#helpers/object.helper.js'
import shopRepo from '#models/repository/shop.repo.js'
import spuRepo from '#models/repository/spu.repo.js'
import { spuModel } from '#models/spu.model.js'
import { ELASTIC_INDEX } from '#utils/constant.js'
import converter from '#utils/converter.js'
import { generateSpuId } from '#utils/generator.js'
import { StatusCodes } from 'http-status-codes'
import skuService from './sku.service.js'
import { getMinPriceFromSkus, getTotalStockFromSkus } from '#utils/data.js'
import { validateProductOwnership } from '#helpers/spu.helper.js'
import { LOW_STOCK_THRESHOLD } from '#utils/constant.js'
import { skuModel } from '#models/sku.model.js'
import inventoryService from './inventory.service.js'

const createSpu = async ({ reqBody, userId, userEmail }) => {
  const {
    spu_shopId,
    spu_attributes,
    spu_variations,
    spu_category,
    sku_list,
    isPublished,
    spu_price,
    spu_quantity,
    ...spuData } = reqBody


  //xử lý đồng thời tìm shop và lấy attribute đã xử lý ra (gồm id, name, value)
  const [foundShop, normalizedAttrs] = await Promise.all([
    shopRepo.findShopByIdAndOwnId({ shopId: spu_shopId, ownId: userId }),
    validateAndNormalizeAttributes({ spu_attributes, spu_category })
  ])

  if (!foundShop) throw new ApiError(StatusCodes.BAD_REQUEST, 'Shop does not exists!')

  //tạo 1 spu
  const newSpu = await spuModel.create({
    spu_code: generateSpuId(),
    ...spuData,
    spu_shopId: converter.toObjectId(spu_shopId),
    spu_attributes: normalizedAttrs,
    spu_variations,
    spu_category: spu_category,
    spu_price: getMinPriceFromSkus(sku_list) || spu_price,
    spu_quantity: getTotalStockFromSkus(sku_list) || spu_quantity,
  })

  let newSku = null
  //nếu có sku_list thì xử lý tạo sku
  if (newSpu && (sku_list && sku_list.length)) {
    newSku = await skuService.createSku({
      spu_id: newSpu._id, sku_list, spu_code: newSpu.spu_code,
      spu_shopId: newSpu.spu_shopId,
      userId,
      userEmail
    })
  }
  else {
    newSku = await skuModel.create({
      sku_spuId: newSpu._id,
      sku_id: newSpu.spu_code,
      sku_price: newSpu.spu_price,
      sku_stock: newSpu.spu_quantity,
      isPublished: isPublished, isDraft: !isPublished
    })
    await inventoryService.addStockToInventory({
      shopId: spu_shopId,
      userId,
      userEmail,
      reqBody: {
        productId: newSpu._id,
        skuId: newSku._id,
        stock: newSpu.spu_quantity,
        note: 'phiếu nhập kho ban đầu'
      }
    })
  }
  if (isPublished === true) {
    newSpu = await publishProduct({ productId: newSpu._id, userId })
  }

  //lưu vào elastic
  await syncProdcutToEs(newSpu._id)
  return newSpu
}

const updateProduct = async ({ productId, reqBody, userId }) => {
  //các fields dc cho phép update
  const allowedFields = [
    'spu_name', 'spu_thumb', 'spu_description',
    'spu_price', 'spu_category', 'spu_attributes',
    'spu_variations', 'sku_list', 'spu_code'
  ]
  //các bước check business
  const { foundProduct } = await validateProductOwnership({ productId, userId })
  //nếu có gửi sku_list để update thì update sku trước
  if (reqBody.sku_list && reqBody.sku_list.length > 0) {
    const updatedSkus = await skuService.updateSkuBySpuId({
      spuId: foundProduct._id,
      spuCode: foundProduct.spu_code,
      skuList: reqBody.sku_list,
      isPublished: foundProduct.isPublished,
    })
    //set lại giá khi đã update sku
    reqBody.spu_price = getMinPriceFromSkus(updatedSkus)
    reqBody.spu_quantity = getTotalStockFromSkus(updatedSkus)
  }
  //xử lý xong hết rồi thì update product
  const updatedProduct = await updateSubModel({ model: spuModel, id: foundProduct._id, payload: reqBody, allowedFields })
  //lưu vào elastic
  await syncProdcutToEs(updatedProduct._id)

  return updatedProduct
}


const unPublishProduct = async ({ productId, userId }) => {
  const { foundShop } = await validateProductOwnership({ productId, userId })
  const result = await spuRepo.changePublishStatus({
    productId,
    shopId: foundShop._id,
    isPublished: false,
    isDeleted: false
  })
  await syncProdcutToEs(result._id)
  return result
}

const publishProduct = async ({ productId, userId }) => {
  const { foundShop } = await validateProductOwnership({ productId, userId })
  const result = await spuRepo.changePublishStatus({
    productId,
    shopId: foundShop._id,
    isPublished: true,
    isDeleted: false
  })
  await syncProdcutToEs(result._id)
  return result
}

const getPublishedProduct = async ({ userId, limit = 50, page = 1 }) => {
  const foundShop = await shopRepo.findShopByUserId(userId)
  if (!foundShop) throw new ApiError(StatusCodes.FORBIDDEN, 'Not permission to update this product!')
  const filter = {
    spu_shopId: converter.toObjectId(foundShop._id),
    isPublished: true,
    isDeleted: false
  }
  return await spuRepo.findAllProducts({ limit, page, filter })
}

const getDraftProduct = async ({ userId, limit = 50, page = 1 }) => {
  const foundShop = await shopRepo.findShopByUserId(userId)
  if (!foundShop) throw new ApiError(StatusCodes.FORBIDDEN, 'Not permission to update this product!')
  const filter = {
    product_shopId: converter.toObjectId(foundShop._id),
    isDraft: true,
    isDeleted: false
  }
  return await spuRepo.findAllProducts({ limit, page, filter })
}

const getAllProducts = async ({ limit = 50, sort = 'ctime', page = 1 }, shopId) => {
  const filter = { isPublished: true, isDeleted: false, ...(shopId && { shopId }), spu_quantity: { $gt: 0 } }
  const select = ['spu_name', 'spu_code', 'spu_price', 'spu_thumb', 'spu_quantity', 'is_flash_sale']
  const limitNumber = Number(limit)
  const pageNumber = Number(page)
  const { products, totalItems } = await spuRepo.findAllProducts({ limit: limitNumber, sort, page: pageNumber, filter, select })
  const totalPages = Math.ceil(totalItems / limitNumber)
  return {
    products,
    totalItems,
    totalPages,
    currentPage: pageNumber,
    limit: limitNumber
  }
}

const getProductDetail = async ({ productId }) => {
  const spuDetail = await spuRepo.findProductDetail(productId)
  if (!spuDetail) { return null }
  const skuList = await skuService.getAllSkuBySpuId(spuDetail._id)
  return {
    ...spuDetail,
    sku_list: skuList
  }
}

const deleteProduct = async ({ productId, userId }) => {
  const { foundProduct } = await validateProductOwnership({ productId, userId })
  await Promise.all([
    await spuRepo.deleteProduct(foundProduct.spu_code),
    await ElasticClient.delete({
      index: ELASTIC_INDEX.PRODUCT,
      id: foundProduct._id.toString()
    })
  ])
  return { success: 'success' }
}

const searchProduct = async ({ keyword, category, minPrice, status, stock, sortBy, sortOrder = 'desc', maxPrice, page = 1, limit = 20 }) => {
  const must = []
  const filter = []
  if (keyword) {
    must.push({
      bool: {
        should: [
          {
            multi_match: {
              query: keyword,
              fields: ['spu_name^2', 'spu_description'],
              fuzziness: 'AUTO'
            }
          },
          {
            prefix: {
              spu_name: keyword
            }
          }
        ],
        minimum_should_match: 1
      }
    })
  }

  if (category) filter.push({ term: { spu_category: category } })
  if (status) {
    filter.push({ term: { isPublished: status === 'published' ? true : false } })
  } else {
    filter.push({ term: { isPublished: true } })
  }
  if (stock) {
    if (stock === 'in') filter.push({ range: { spu_quantity: { gte: 10 } } })
    else if (stock === 'low') filter.push({ range: { spu_quantity: { gt: 0, lt: LOW_STOCK_THRESHOLD } } })
    else if (stock === 'out') filter.push({ term: { spu_quantity: 0 } })
    else filter.push({ range: { spu_quantity: { gt: 0 } } })
  }

  let sortParams = []
  const orderDirection = sortOrder === 'asc' ? 'asc' : 'desc'

  if (sortBy === 'price') { sortParams.push({ spu_price: orderDirection }) }
  else if (sortBy === 'time') { sortParams.push({ createdAt: orderDirection }) }
  else if (sortBy === 'name') { sortParams.push({ 'spu_name.keyword': orderDirection }) }
  else {
    if (keyword) {
      sortParams.push({ _score: 'desc' })
    } else {
      sortParams.push({ createdAt: 'desc' })
    }
  }

  if (minPrice || maxPrice) {
    const rangeQuery = { range: { spu_price: {} } }
    if (minPrice) rangeQuery.range.spu_price.gte = minPrice
    if (maxPrice) rangeQuery.range.spu_price.lte = maxPrice
    filter.push(rangeQuery)
  }

  filter.push({ term: { isDeleted: false } })

  const result = await ElasticClient.search({
    index: ELASTIC_INDEX.PRODUCT,
    query: { bool: { must, filter } },
    from: (page - 1) * limit,
    size: limit,
    sort: sortParams,
    _source: ['mongo_id', 'spu_thumb', 'spu_name', 'spu_price', 'spu_ratingsAvg', 'spu_category', 'spu_code', 'spu_quantity']
  })
  const totalItems = typeof result.hits.total === 'object' ? result.hits.total.value : result.hits.total
  const totalPages = Math.ceil(totalItems / limit)

  return {
    products: result.hits.hits.map(hit => hit._source),
    totalItems,
    totalPages,
    currentPage: page,
    limit
  }
}

export default {
  createSpu,
  updateProduct,
  publishProduct,
  unPublishProduct,
  getPublishedProduct,
  getDraftProduct,
  getAllProducts,
  getProductDetail,
  deleteProduct,
  searchProduct,
}


