import productController from '#controllers/product.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'

const Router = express.Router()

Router.post('', asyncHandler(productController.createProduct))
Router.patch('/:productId', asyncHandler(productController.updateProduct))

export const ProductRouter = Router