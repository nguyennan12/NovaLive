
import shopController from '#controllers/shop.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'
import grantAcess from '#middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('/register', grantAcess('createOwn', 'shop'), asyncHandler(shopController.registerShop))
Router.get('', grantAcess(['readOwn'], 'shop'), asyncHandler(shopController.getShopByUser))
Router.patch('/:shopId', grantAcess(['updateOwn'], 'shop'), asyncHandler(shopController.updateInfoShop))
Router.delete('/:shopId', grantAcess(['deleteOwn'], 'shop'), asyncHandler(shopController.deleteShop))

export const shopRouter = Router