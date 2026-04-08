import inventoryController from '#controllers/inventory.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import authentication from '#middlewares/authentication.middleware.js'
import express from 'express'

const Router = express.Router()

Router.use(authentication)

Router.post('/', asyncHandler(inventoryController.addStockToInventory))

export const inventoryRouter = Router