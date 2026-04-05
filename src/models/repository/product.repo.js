import { ProductModel } from '#models/product.model.js'
import converter from '#utils/converter.js'

const updateProductById = async ({ productId, reqBody, model }) => {
  return await model.findByIdAndUpdate(productId, reqBody, { returnDocument: 'after' }).lean()
}

const findByIdAndShopid = async ({ productId, shopId }) => {
  return await ProductModel.findOne({ _id: converter.toObjectId(productId), product_shopId: converter.toObjectId(shopId) }).lean()
}


const changePublishStatus = async ({ productId, shopId, isPublished }) => {
  return await ProductModel.findOneAndUpdate(
    { _id: productId, product_shopId: converter.toObjectId(shopId) },
    { $set: { isDraft: !isPublished, isPublished: isPublished } },
    { returnDocument: 'after' }
  ).lean()
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  return await ProductModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()
}

const getProductDetail = async (productId) => {
  const result = await ProductModel.findById(converter.toObjectId(productId))
  return result
}

const searchProducts = async ({ keySearch }) => {
  const results = await ProductModel.find(
    {
      $text: { $search: keySearch },
      isDraft: false
    },
    {
      score: { $meta: 'textScore' }
    }
  )
    .sort({ score: { $meta: 'textScore' } })
    .lean()

  return results
}

const findProductById = async (productId) => {
  return await ProductModel.findById(productId).lean()
}

export default {
  updateProductById,
  findByIdAndShopid,
  changePublishStatus,
  findAllProducts,
  getProductDetail,
  searchProducts,
  findProductById
}