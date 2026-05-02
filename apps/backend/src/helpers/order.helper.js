import { skuModel } from '#models/sku.model.js'
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'

export const validateBuyNowItems = async ({ shopOrderIds }) => {
  if (!shopOrderIds || !Array.isArray(shopOrderIds)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing shop order information')
  }
  const skusFromClient = shopOrderIds.flatMap(shop => shop.item_products.map(item => item.skuId.toString()))
  const validSkusCount = await skuModel.countDocuments({ _id: { $in: skusFromClient } })
  //nếu prodcut khác thì throw lỗi
  if (validSkusCount !== skusFromClient.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Do not have product in system')
  }
}
