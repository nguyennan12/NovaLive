import { ElasticClient } from '#database/init.elasticsearch.js'
import { spuModel } from '#models/spu.model.js'
import { ELASTIC_INDEX } from '#utils/constant.js'
import spuRepo from '#models/repository/spu.repo.js'
import shopRepo from '#models/repository/shop.repo.js'
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'

export const transformSPUtoES = (doc) => {
  return {
    mongo_id: doc._id.toString(),
    spu_name: doc.spu_name,
    spu_slug: doc.spu_slug,
    spu_description: doc.spu_description,
    spu_price: doc.spu_price,
    spu_quantity: doc.spu_quantity,
    spu_category: doc.spu_category,
    spu_ratingsAvg: doc.spu_ratingsAvg,
    spu_thumb: doc.spu_thumb,
    total_sold: doc.total_sold,
    spu_shopId: doc.spu_shopId?.toString(),

    spu_attributes: doc.spu_attributes?.map(attr => ({
      attr_id: attr.attr_id,
      attr_name: attr.attr_name,
      attr_value: attr.attr_value
    })),

    isPublished: doc.isPublished,
    isDeleted: doc.isDeleted,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }
}

export const shouldSync = (doc) => doc.isDeleted === false


export const syncProdcutToEs = async (productId) => {
  const updatedProduct = await spuModel.findById(productId)
  if (updatedProduct && shouldSync(updatedProduct)) {
    const result = await ElasticClient.index({
      index: ELASTIC_INDEX.PRODUCT,
      id: updatedProduct._id.toString(),
      document: transformSPUtoES(updatedProduct)
    })
    return result
  }

}

export const validateProductOwnership = async ({ productId, userId }) => {
  const foundProduct = await spuRepo.findProductById(productId)
  if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product does not exist!')
  const foundShop = await shopRepo.findShopByIdAndOwnId({
    shopId: foundProduct.spu_shopId,
    ownId: userId
  })
  if (!foundShop) throw new ApiError(StatusCodes.FORBIDDEN, 'No permission to access this product!')
  return { foundProduct, foundShop }
}

