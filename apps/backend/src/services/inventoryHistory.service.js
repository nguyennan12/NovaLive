import { inventoryHistoryModel } from '#models/inventoryHistory.model.js'
import converter from '#utils/converter.js'

const createHistory = async ({
  shopId,
  productId,
  skuId,
  userId,
  userEmail,
  type,
  quantity,
  oldStock,
  newStock,
  reason,
  note,
  location
}) => {
  return await inventoryHistoryModel.create({
    inven_shopId: converter.toObjectId(shopId),
    inven_productId: converter.toObjectId(productId),
    inven_skuId: converter.toObjectId(skuId),
    inven_userId: converter.toObjectId(userId),
    inven_userEmail: userEmail,
    inven_type: type,
    inven_quantity: quantity,
    inven_oldStock: oldStock,
    inven_newStock: newStock,
    inven_reason: reason,
    inven_note: note,
    inven_location: location
  })
}

const getHistoryByShop = async ({ shopId, limit = 50, page = 1 }) => {
  const skip = (page - 1) * limit
  const histories = await inventoryHistoryModel.find({
    inven_shopId: converter.toObjectId(shopId)
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'inven_productId',
      select: 'spu_name'
    })
    .populate({
      path: 'inven_skuId',
      select: 'sku_name sku_id'
    })
    .lean()

  const totalItems = await inventoryHistoryModel.countDocuments({
    inven_shopId: converter.toObjectId(shopId)
  })

  return {
    items: histories,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: Number(page)
  }
}

export default {
  createHistory,
  getHistoryByShop
}
