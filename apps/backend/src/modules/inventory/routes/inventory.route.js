import inventoryController from '#modules/inventory/controllers/inventory.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import authentication from '#shared/middlewares/authentication.middleware.js'
import express from 'express'
import validate from '#shared/middlewares/validate.middleware.js'
import { addStockSchema } from '#validations/inventory.validation.js'
import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)

Router.post('/', grantAccess('create:own', 'INVENTORY'), validate(addStockSchema), asyncHandler(inventoryController.addStockToInventory))
Router.get('/history', grantAccess('read:own', 'INVENTORY'), asyncHandler(inventoryController.getHistoryInventoryByShop))
Router.get('/chart', grantAccess('read:own', 'INVENTORY'), asyncHandler(inventoryController.getChartDataByShop))

export const inventoryRouter = Router
