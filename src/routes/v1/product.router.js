import productController from '#controllers/product.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import authentication from '#middlewares/authentication.middleware.js'
import express from 'express'

const Router = express.Router()
// === User ===
Router.get('/search/', asyncHandler(productController.searchProduct))
Router.get('', asyncHandler(productController.getAllProducts))
Router.get('/:productId', asyncHandler(productController.getProductDetail))
//  === Authentication ===
Router.use(authentication)
// === Shop ===
Router.post('', asyncHandler(productController.createProduct))
Router.patch('/:productId', asyncHandler(productController.updateProduct))
Router.patch('/:productId/publish', asyncHandler(productController.publishProduct))
Router.patch('/:productId/unpublish', asyncHandler(productController.unPublishProduct))
Router.get('/public', asyncHandler(productController.getPublishedProduct))
Router.get('/draft', asyncHandler(productController.getDraftProduct))


export const ProductRouter = Router