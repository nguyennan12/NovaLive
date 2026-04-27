import express from 'express'
import inventoryHistoryController from '#controllers/inventoryHistory.controller.js'
import authentication from '#middlewares/authentication.middleware.js'
import asyncHandler from '#helpers/asyncHandler.js'

const Router = express.Router()

// Authentication middleware
Router.use(authentication)

Router.get('/shop', asyncHandler(inventoryHistoryController.getHistoryByShop))

export const InventoryHistoryRouter = Router
