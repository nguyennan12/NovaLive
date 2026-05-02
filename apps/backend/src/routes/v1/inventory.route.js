import inventoryController from '#controllers/inventory.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import authentication from '#middlewares/authentication.middleware.js'
import express from 'express'

import grantAccess from '#middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)

Router.post('/', grantAccess('create:own', 'INVENTORY'), asyncHandler(inventoryController.addStockToInventory))
Router.get('/history', grantAccess('read:own', 'INVENTORY'), asyncHandler(inventoryController.getHistoryInventoryByShop))
Router.get('/chart', grantAccess('read:own', 'INVENTORY'), asyncHandler(inventoryController.getChartDataByShop))

export const inventoryRouter = Router