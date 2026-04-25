/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import inventoryService from '#services/inventory.service.js'
import { StatusCodes } from 'http-status-codes'

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

export default {
  addStockToInventory
}