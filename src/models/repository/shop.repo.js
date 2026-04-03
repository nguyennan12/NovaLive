import shopModel from '#models/shop.model.js'
import converter from '#utils/converter.js'

const findShopByUserId = async (userId) => {
  return await shopModel.findOne({ shop_owner: userId, shop_status: 'active' }).lean()
}
const findShopByIdAndOwnId = async ({ shopId, userId }) => {
  return await shopModel.findOne({
    _id: converter.toObjectId(shopId),
    shop_owner: userId,
    shop_status: 'active'
  }).lean()
}

const changeStatus = async (shopId, status) => {
  return await shopModel.updateOne(
    { _id: converter.toObjectId(shopId) },
    { $set: { shop_status: status } }
  )
}

export default {
  findShopByUserId,
  findShopByIdAndOwnId,
  changeStatus
}