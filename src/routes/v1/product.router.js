import productController from '#controllers/product.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import authentication from '#middlewares/authentication.middleware.js'
import express from 'express'

import validate from '#middlewares/validate.middleware.js'
import { productValidation } from '#validations/product.validation.js'
const Router = express.Router()
// === User ===
Router.get('/search/', asyncHandler(productController.searchProduct))
Router.get('', asyncHandler(productController.getAllProducts))
Router.get('/:productId', asyncHandler(productController.getProductDetail))
//  === Authentication ===
Router.use(authentication)
// === Shop ===
Router.post('', validate(productValidation.create), asyncHandler(productController.createProduct))
Router.patch('/:productId', validate(productValidation.paramsProductId), asyncHandler(productController.updateProduct))
Router.patch('/:productId/publish', validate(productValidation.paramsProductId), asyncHandler(productController.publishProduct))
Router.patch('/:productId/unpublish', validate(productValidation.paramsProductId), asyncHandler(productController.unPublishProduct))
Router.get('/public', asyncHandler(productController.getPublishedProduct))
Router.get('/draft', asyncHandler(productController.getDraftProduct))

export const ProductRouter = Router