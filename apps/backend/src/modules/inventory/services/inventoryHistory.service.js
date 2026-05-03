/* eslint-disable indent */
import { inventoryHistoryModel } from '#modules/inventory/models/inventoryHistory.model.js'
import converter from '#shared/utils/converter.js'

const createHistory = async ({ shopId, productId, skuId, userId, userEmail, type, quantity, oldStock, newStock, reason, note, location }) => {
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

const getHistoryByShop = async ({ shopId, limit = 50, page = 1, type = 'all' }) => {
  const skip = (page - 1) * limit
  const filter = { inven_shopId: converter.toObjectId(shopId) }
  if (type !== 'all') filter.inven_type = type
  const histories = await inventoryHistoryModel.find(filter)
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

const getChartDataByShop = async ({ shopId, period = 'today' }) => {
  const shopObjectId = converter.toObjectId(shopId)

  const TIMEZONE = '+07:00'

  const getAggregation = (startDate, format) => [
    {
      $match: {
        inven_shopId: shopObjectId,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          label: { $dateToString: { format, date: '$createdAt', timezone: TIMEZONE } },
          type: '$inven_type'
        },
        total: { $sum: '$inven_quantity' }
      }
    },
    {
      $group: {
        _id: '$_id.label',
        in: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'IN'] }, '$total', 0] }
        },
        out: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'OUT'] }, '$total', 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        label: '$_id',
        in: 1,
        out: 1
      }
    },
    { $sort: { label: 1 } }
  ]

  let startDate = new Date()
  let format = ''

  switch (period) {
    case 'week':
      startDate.setDate(startDate.getDate() - 7)
      format = '%Y-%m-%d'
      break
    case 'month':
      startDate.setDate(startDate.getDate() - 28)
      format = 'Wk %V'
      break
    case 'today':
    default:
      startDate.setHours(0, 0, 0, 0)
      format = '%H:00'
      break
  }

  const chartData = await inventoryHistoryModel.aggregate(getAggregation(startDate, format))

  return chartData
}

export default {
  createHistory,
  getHistoryByShop,
  getChartDataByShop
}
