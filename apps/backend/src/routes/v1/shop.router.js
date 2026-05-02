
import shopController from '#controllers/shop.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'
import grantAccess from '#middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('/register', asyncHandler(shopController.registerShop))
Router.get('', asyncHandler(shopController.getShopByUser))
Router.patch('/:shopId', grantAccess(['update:own'], 'SHOP'), asyncHandler(shopController.updateInfoShop))
Router.get('/:shopId', asyncHandler(shopController.getInfoShop))
Router.delete('/:shopId', grantAccess(['delete:own'], 'SHOP'), asyncHandler(shopController.deleteShop))

export const shopRouter = Router