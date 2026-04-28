import discountController from '#controllers/discount.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'
import validate from '#middlewares/validate.middleware.js'
import { createDiscountSchema, updateDiscountSchema } from '#models/dtos/discount.dto.js'

const Router = express.Router()

Router.get('/', asyncHandler(discountController.getAllDiscount))
Router.get('/query', asyncHandler(discountController.queryDiscounts))
Router.get('/shop/:shopId', asyncHandler(discountController.getAllDiscountOfShop))
Router.get('/products/:discountCode', asyncHandler(discountController.getProductsByDiscount))


Router.use(authentication)
Router.get('/amount', asyncHandler(discountController.getDiscountAmout))
Router.post('/', validate(createDiscountSchema), asyncHandler(discountController.craeteDiscount))
Router.post('/:discountCode', asyncHandler(discountController.cancelDiscountCode))
Router.patch('/:discountCode', validate(updateDiscountSchema), asyncHandler(discountController.updateDiscount))
Router.delete('/:discountCode', asyncHandler(discountController.deleteDiscount))


export const discountRouter = Router