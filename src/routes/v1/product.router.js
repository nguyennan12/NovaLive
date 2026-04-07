import productController from '#controllers/product.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import authentication from '#middlewares/authentication.middleware.js'
import express from 'express'
// import { productValidation } from '#validations/product.validation.js'
// import grantAcess from '#middlewares/rbac.middleware.js'

const Router = express.Router()
// === User ===
Router.get('/search/', asyncHandler(productController.searchProduct))
Router.get('/variation/', asyncHandler(productController.getOneSku))
Router.get('/variations/:spuId', asyncHandler(productController.getAllSkuBySpuId))
Router.get('', asyncHandler(productController.getAllProducts))
Router.get('/detail/:productId', asyncHandler(productController.getProductDetail))
//  === Authentication ===
Router.use(authentication)
// === Shop ===
//Router.post('', validate(productValidation.create), grantAcess('createAny', 'product'), asyncHandler(productController.createProduct))
Router.post('', asyncHandler(productController.createProduct))
Router.patch('/:productId', asyncHandler(productController.updateProduct))
Router.patch('/:productId/sku/:skuId', asyncHandler(productController.updateSingleSku))
Router.patch('/:productId/publish', asyncHandler(productController.publishProduct))
Router.patch('/:productId/unpublish', asyncHandler(productController.unPublishProduct))
Router.get('/public', asyncHandler(productController.getPublishedProduct))
Router.get('/draft', asyncHandler(productController.getDraftProduct))
Router.delete('/:productId', asyncHandler(productController.deleteProduct))

export const ProductRouter = Router