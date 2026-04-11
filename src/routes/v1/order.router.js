import orderController from '#controllers/order.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('/checkout', asyncHandler(orderController.checkoutReview))
Router.post('/', asyncHandler(orderController.orderByUser))

export const orderRouter = Router