import ApiError from '#core/error.response.js'
import { ElasticClient } from '#database/init.elasticsearch.js'
import { validateAndNormalizeAttributes } from '#helpers/attribute.help.js'
import { syncProdcutToEs, transformSPUtoES } from '#helpers/SpuToEs.js'
import { updateSubModel } from '#helpers/update.helper.js'
import shopRepo from '#models/repository/shop.repo.js'
import spuRepo from '#models/repository/spu.repo.js'
import { spuModel } from '#models/spu.model.js'
import converter from '#utils/converter.js'
import { generateSpuId } from '#utils/generator.js'
import { StatusCodes } from 'http-status-codes'
import skuService from './sku.service.js'
import { ELASTIC_INDEX } from '#utils/constant.js'

const createSpu = async ({ reqBody, ownId }) => {
  const { spu_id,
    spu_shopId,
    spu_attributes,
    spu_variations,
    spu_category,
    sku_list,
    ...spuData } = reqBody

  const [foundShop, normalizedAttrs] = await Promise.all([
    shopRepo.findShopByIdAndOwnId({ shopId: spu_shopId, ownId }),
    validateAndNormalizeAttributes({ spu_attributes, spu_category })
  ])

  if (!foundShop) throw new ApiError(StatusCodes.BAD_REQUEST, 'Shop does not exists!')

  const newSpu = await spuModel.create({
    spu_id: generateSpuId(spu_id),
    ...spuData,
    spu_shopId: converter.toObjectId(spu_shopId),
    spu_attributes: normalizedAttrs,
    spu_variations,
    spu_category: spu_category,
    spu_price: Math.min(...sku_list.map(s => s.sku_price)),
    spu_quantity: sku_list.reduce((sum, s) => sum + s.sku_stock, 0),
  })

  if (newSpu && sku_list.length) {
    await skuService.createSku({ spu_id: newSpu.spu_id, sku_list })
  }

  await syncProdcutToEs(newSpu._id)
  return newSpu
}

const updateProduct = async ({ productId, reqBody, userId }) => {
  const allowedFields = [
    'spu_name', 'spu_thumb', 'spu_description',
    'spu_price', 'spu_category', 'spu_attributes',
    'spu_variations', 'sku_list'
  ]
  const foundProduct = await spuRepo.findProductDetail(productId)
  if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product does not exist!')

  const foundShop = await shopRepo.findShopByIdAndOwnId({ shopId: foundProduct.spu_shopId, ownId: userId })

  if (reqBody.sku_list && reqBody.sku_list.length > 0) {
    await skuService.updateSkuBySpuId({ spuId: productId, skuList: reqBody.sku_list })

    reqBody.spu_price = Math.min(...reqBody.sku_list.map(s => s.sku_price))
    reqBody.spu_quantity = reqBody.sku_list.reduce((sum, s) => sum + s.sku_stock, 0)
  }

  if (!foundShop) throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this product!')
  const updatedProduct = await updateSubModel({ model: spuModel, id: foundProduct._id, payload: reqBody, allowedFields })

  await syncProdcutToEs(updatedProduct._id)

  return updatedProduct
}


const unPublishProduct = async ({ productId, userId }) => {
  const foundProduct = await spuRepo.findProductDetail(productId)
  if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found!')

  const foundShop = await shopRepo.findShopByIdAndOwnId({ shopId: foundProduct.spu_shopId, ownId: userId })
  if (!foundShop) throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this product!')

  const result = await spuRepo.changePublishStatus({
    productId,
    shopId: foundShop._id,
    isPublished: false,
    isDeleted: false
  })
  if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, 'Operation failed')
  await syncProdcutToEs(result._id)
  return result
}

const publishProduct = async ({ productId, userId }) => {
  const foundProduct = await spuRepo.findProductDetail(productId)
  if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found!')

  const foundShop = await shopRepo.findShopByIdAndOwnId({ shopId: foundProduct.spu_shopId, ownId: userId })
  if (!foundShop) throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this product!')

  const result = await spuRepo.changePublishStatus({
    productId,
    shopId: foundShop._id,
    isPublished: true,
    isDeleted: false
  })
  if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, 'Operation failed')
  await syncProdcutToEs(result._id)
  return result
}

const getPublishedProduct = async ({ userId, limit = 50, page = 1 }) => {
  const foundShop = await shopRepo.findShopByUserId(userId)
  if (!foundShop) throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this product!')
  const filter = {
    spu_shopId: converter.toObjectId(foundShop._id),
    isPublished: true,
    isDeleted: false
  }
  return await spuRepo.findAllProducts({ limit, page, filter })
}

const getDraftProduct = async ({ userId, limit = 50, page = 1 }) => {
  const foundShop = await shopRepo.findShopByUserId(userId)
  if (!foundShop) throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this product!')
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
  const foundProduct = await spuRepo.findProductDetail(productId)
  if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found!')

  const foundShop = await shopRepo.findShopByIdAndOwnId({ shopId: foundProduct.spu_shopId, ownId: userId })
  if (!foundShop) throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to detele this product!')

  const result = await spuRepo.deleteProduct(productId)
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


