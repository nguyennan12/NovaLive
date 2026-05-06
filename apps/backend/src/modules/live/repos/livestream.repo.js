import livestreamModel from '#modules/live/models/livestream.model.js'
import converter from '#shared/utils/converter.js'

const findLiveByIdAndType = async (liveId, type) => {
  return await livestreamModel.findOne({ _id: converter.toObjectId(liveId), live_status: type }).lean()
}

const findLiveByIdAndShopId = async (liveId, shopId) => {
  return await livestreamModel.findOne({ _id: converter.toObjectId(liveId), live_shopId: converter.toObjectId(shopId) }).lean()
}

const addProductToLiveSession = async (liveId, products) => {
  return await livestreamModel.findOneAndUpdate(
    { _id: converter.toObjectId(liveId), live_status: { $in: ['scheduled', 'live'] } },
    {
      $push: {
        live_products: { $each: products }
      }
    },
    { returnDocument: 'after' }
  )
}

const getLiveById = async (liveId) => {
  return await livestreamModel.findById(converter.toObjectId(liveId)).lean()
}

const removeProductFromLiveSession = async (liveId, productId) => {
  return await livestreamModel.findOneAndUpdate(
    { _id: converter.toObjectId(liveId), live_status: { $in: ['scheduled', 'live'] } },
    { $pull: { live_products: { productId: converter.toObjectId(productId) } } },
    { returnDocument: 'after' }
  )
}

const findAllLiveSession = async ({ skip, limit, filter }) => {
  return livestreamModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
}

export default {
  findLiveByIdAndType,
  findLiveByIdAndShopId,
  addProductToLiveSession,
  getLiveById,
  removeProductFromLiveSession,
  findAllLiveSession,
}