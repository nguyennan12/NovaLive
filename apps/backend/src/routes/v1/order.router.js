import orderController from '#controllers/order.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('/checkout', asyncHandler(orderController.checkoutReview))
Router.post('/', asyncHandler(orderController.orderByUser))
Router.patch('/:orderId/status', asyncHandler(orderController.updateOrderStatusAdmin))
Router.get('/my-orders', asyncHandler(orderController.getAllOrderByUser))
Router.get('/my-orders/:orderId', asyncHandler(orderController.getOrderDetail))
Router.get('/my-orders/:orderId', asyncHandler(orderController.getOrderDetail))


export const orderRouter = Router