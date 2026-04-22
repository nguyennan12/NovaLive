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

const createSpu = async ({ reqBody, userId }) => {
  const {
    spu_shopId,
    spu_attributes,
    spu_variations,
    spu_category,
    sku_list,
    isPublished,
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
    spu_price: getMinPriceFromSkus(sku_list),
    spu_quantity: getTotalStockFromSkus(sku_list),
  })

  //nếu có sku_list thì xử lý tạo sku
  if (newSpu && sku_list.length) {
    await skuService.createSku({ spu_id: newSpu._id, sku_list, spu_code: newSpu.spu_code })
  }
  if (isPublished === true) {
    await publishProduct({ productId: newSpu._id, userId })
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
    'spu_variations', 'sku_list'
  ]
  //các bước check business
  const { foundProduct } = await validateProductOwnership({ productId, userId })
  //nếu có gửi sku_list để update thì update sku trước
  if (reqBody.sku_list && reqBody.sku_list.length > 0) {
    const updatedSkus = await skuService.updateSkuBySpuId({
      spuId: foundProduct._id,
      spuCode: foundProduct.spu_code,
      skuList: reqBody.sku_list
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

const getAllProducts = async ({ limit = 50, sort = 'ctime', page = 1 }) => {
  const filter = { isPublished: true, isDeleted: false }
  const select = ['spu_name', 'spu_price', 'spu_thumb']
  return await spuRepo.findAllProducts({ limit, sort, page, filter, select })
}

const getProductDetail = async ({ productId }) => {
  return await spuRepo.findProductDetail(productId)
}

const deleteProduct = async ({ productId, userId }) => {
  const { foundProduct } = await validateProductOwnership({ productId, userId })
  const result = await spuRepo.deleteProduct(foundProduct.spu_code)
  if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, 'Operation failed')
  await ElasticClient.delete({
    index: ELASTIC_INDEX.PRODUCT,
    id: result._id.toString()
  })
  return result
}

const searchProduct = async ({ keyword, category, minPrice, maxPrice, page = 1, limit = 20 }) => {
  const must = []
  const filter = []
  if (keyword) {
    must.push({
      multi_match: {
        query: keyword,
        fields: ['spu_name^2', 'spu_description'],
        fuzziness: 'AUTO'
      }
    })
  }

  if (category) filter.push({ term: { spu_category: category } })
  if (minPrice || maxPrice) {
    const rangeQuery = { range: { spu_price: {} } }
    if (minPrice) rangeQuery.range.spu_price.gte = minPrice
    if (maxPrice) rangeQuery.range.spu_price.lte = maxPrice
    filter.push(rangeQuery)
  }
  filter.push({ term: { isPublished: true } })
  filter.push({ term: { isDeleted: false } })

  const result = await ElasticClient.search({
    index: ELASTIC_INDEX.PRODUCT,
    query: { bool: { must, filter } },
    from: (page - 1) * limit,
    size: limit,
    sort: { createdAt: 'desc' }, _source: ['mongo_id', 'spu_name', 'spu_price', 'spu_thumb', 'spu_ratingsAvg', 'spu_category']
  })
  return {
    total: result.hits.total.valueOf,
    page,
    limit,
    products: result.hits.hits.map(hit => hit._source)
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
  searchProduct
}


