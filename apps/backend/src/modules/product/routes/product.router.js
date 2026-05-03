import productController from '#modules/product/controllers/product.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import authentication from '#shared/middlewares/authentication.middleware.js'
import express from 'express'
// import { productValidation } from '#validations/product.validation.js'
import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()
// === User ===
Router.get('/search', asyncHandler(productController.searchProduct))
Router.get('/variation', asyncHandler(productController.getOneSku))
Router.get('/variations/:spuId', asyncHandler(productController.getAllSkuBySpuId))
Router.get('/skus', asyncHandler(productController.querySkusList))
Router.get('/', asyncHandler(productController.getAllProducts))
Router.get('/:productId', asyncHandler(productController.getProductDetail))
//  === Authentication ===
Router.use(authentication)
// === Shop ===
Router.get('/stats', grantAccess('read:own', 'PRODUCT'), asyncHandler(productController.getProductStats))
Router.get('/me/public', grantAccess('read:own', 'PRODUCT'), asyncHandler(productController.getPublishedProduct))
Router.get('/me/draft', grantAccess('read:own', 'PRODUCT'), asyncHandler(productController.getDraftProduct))


Router.post('/', grantAccess('create:own', 'PRODUCT'), asyncHandler(productController.createProduct))

Router.patch('/:productId', grantAccess('update:own', 'PRODUCT'), asyncHandler(productController.updateProduct))
Router.patch('/:productId/sku/:skuId', grantAccess('update:own', 'PRODUCT'), asyncHandler(productController.updateSingleSku))
Router.patch('/:productId/publish', grantAccess('update:own', 'PRODUCT'), asyncHandler(productController.publishProduct))
Router.patch('/:productId/unpublish', grantAccess('update:own', 'PRODUCT'), asyncHandler(productController.unPublishProduct))

Router.delete('/:productId', grantAccess('delete:own', 'PRODUCT'), asyncHandler(productController.deleteProduct))

export const ProductRouter = Router