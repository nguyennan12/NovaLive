import { spuModel } from '#models/spu.model.js'
import converter from '#utils/converter.js'

const findBySpuCode = async (spuCode) => {
  return await spuModel.findOne({ spu_code: spuCode }).lean()
}

const findBySpuId = findBySpuCode

const changePublishStatus = async ({ productId, shopId, isPublished }) => {
  return await spuModel.findOneAndUpdate(
    { _id: productId, spu_shopId: converter.toObjectId(shopId) },
    { $set: { isDraft: !isPublished, isPublished: isPublished } },
    { returnDocument: 'after' }
  ).lean()
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  return await spuModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()
}

const findProductDetail = async (productId) => {
  return await spuModel.findOne({ spu_code: productId, isDeleted: false, isPublished: true }).lean()
}

const findProductById = async (id) => {
  return await spuModel.findById(id).lean()
}

const deleteProduct = async (productId) => {
  return await spuModel.findOneAndUpdate({ spu_code: productId }, { isDeleted: true }).lean()
}

const findProductByIds = async (productIds) => {
  const objectIds = productIds.map(id => converter.toObjectId(id))
  return await spuModel.find({ _id: { $in: objectIds }, isDeleted: false, isPublished: true }).lean()

}

const searchProducts = async ({ keySearch }) => {
  const results = await spuModel.find(
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

export default {
  findBySpuCode,
  findBySpuId,
  changePublishStatus,
  findAllProducts,
  findProductDetail,
  deleteProduct,
  searchProducts,
  findProductByIds,
  findProductById
}