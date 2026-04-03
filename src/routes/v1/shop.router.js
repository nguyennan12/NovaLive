import shopController from '#controllers/shop.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('/register', asyncHandler(shopController.registerShop))
Router.get('', asyncHandler(shopController.getShopByUser))
Router.patch('/:shopId', asyncHandler(shopController.updateInfoShop))
Router.delete('/:shopId', asyncHandler(shopController.deleteShop))


export const shopRouter = Router