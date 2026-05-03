import express from 'express'
import inventoryHistoryController from '#modules/inventory/controllers/inventoryHistory.controller.js'
import authentication from '#shared/middlewares/authentication.middleware.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'

const Router = express.Router()

// Authentication middleware
Router.use(authentication)

Router.get('/shop', asyncHandler(inventoryHistoryController.getHistoryByShop))

export const InventoryHistoryRouter = Router
