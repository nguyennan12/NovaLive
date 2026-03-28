import productController from '#controllers/product.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'

const Router = express.Router()
// === Shop ===
Router.get('/search/', asyncHandler(productController.searchProduct))
Router.post('', asyncHandler(productController.createProduct))
Router.patch('/:productId', asyncHandler(productController.updateProduct))
Router.patch('/:productId/publish', asyncHandler(productController.publishProduct))
Router.patch('/:productId/unpublish', asyncHandler(productController.unPublishProduct))
Router.get('/public', asyncHandler(productController.getPublishedProduct))
Router.get('/draft', asyncHandler(productController.getDraftProduct))

// === User ===
Router.get('', asyncHandler(productController.getAllProducts))

Router.get('/:productId', asyncHandler(productController.getProductDetail))


export const ProductRouter = Router