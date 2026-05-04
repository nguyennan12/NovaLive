/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import inventoryService from '#modules/inventory/services/inventory.service.js'
import { StatusCodes } from 'http-status-codes'
import inventoryHistoryService from '#modules/inventory/services/inventoryHistory.service.js'

const addStockToInventory = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Add stocks successfully!',
    metadata: await inventoryService.addStockToInventory({
      shopId: req.user.shopId,
      userId: req.user.userId,
      userEmail: req.user.email,
      reqBody: req.body
    })
  }).send(res)
}

const getHistoryInventoryByShop = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get inventory history successfully!',
    metadata: await inventoryHistoryService.getHistoryByShop({
      shopId: req.user.shopId,
      ...req.query
    })
  }).send(res)
}

const getChartDataByShop = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get chart data successfully!',
    metadata: await inventoryHistoryService.getChartDataByShop({ shopId: req.user.shopId, ...req.query })
  }).send(res)
}
const getReservedStockByShop = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get reserved stock successfully!',
    metadata: await inventoryService.getReservedStockByShop({ shopId: req.user.shopId })
  }).send(res)
}

export default {
  addStockToInventory,
  getHistoryInventoryByShop,
  getChartDataByShop,
  getReservedStockByShop
}