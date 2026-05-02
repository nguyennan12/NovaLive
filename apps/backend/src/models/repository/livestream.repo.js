import livestreamModel from '#models/livestream.model.js'
import converter from '#utils/converter.js'

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
  findAllLiveSession,
}