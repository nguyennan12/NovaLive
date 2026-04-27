import { StatusCodes } from 'http-status-codes'
import ApiSuccess from '#core/success.response.js'
import inventoryHistoryService from '#services/inventoryHistory.service.js'

class InventoryHistoryController {
  getHistoryByShop = async (req, res, next) => {
    new ApiSuccess({
      statusCode: StatusCodes.OK,
      message: 'Get inventory history successfully!',
      metadata: await inventoryHistoryService.getHistoryByShop({
        shopId: req.user.shopId,
        ...req.query
      })
    }).send(res)
  }
}

export default new InventoryHistoryController()
