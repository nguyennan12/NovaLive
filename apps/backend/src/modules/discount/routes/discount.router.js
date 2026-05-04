import discountController from '#modules/discount/controllers/discount.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import express from 'express'
import authentication from '#shared/middlewares/authentication.middleware.js'
import validate from '#shared/middlewares/validate.middleware.js'
import { createDiscountSchema, updateDiscountSchema } from '#validations/discount.validation.js'

import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()

Router.get('/', asyncHandler(discountController.getAllDiscount))
Router.get('/query', asyncHandler(discountController.queryDiscounts))
Router.get('/shop/:shopId', asyncHandler(discountController.getAllDiscountOfShop))
Router.get('/products/:discountCode', asyncHandler(discountController.getProductsByDiscount))


Router.use(authentication)
Router.get('/amount', grantAccess('read:any', 'DISCOUNT'), asyncHandler(discountController.getDiscountAmout))
Router.post('/', grantAccess('create:own', 'DISCOUNT'), validate(createDiscountSchema), asyncHandler(discountController.craeteDiscount))
Router.post('/:discountCode', grantAccess('update:own', 'DISCOUNT'), asyncHandler(discountController.cancelDiscountCode))
Router.patch('/:discountCode', grantAccess('update:own', 'DISCOUNT'), validate(updateDiscountSchema), asyncHandler(discountController.updateDiscount))
Router.post('/available/:discountCode', grantAccess('read:any', 'DISCOUNT'), validate(updateDiscountSchema), asyncHandler(discountController.checkDiscountAvailable))
Router.delete('/:discountCode', grantAccess('delete:own', 'DISCOUNT'), asyncHandler(discountController.deleteDiscount))


export const discountRouter = Router