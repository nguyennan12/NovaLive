import orderController from '#modules/order/controllers/order.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import express from 'express'
import authentication from '#shared/middlewares/authentication.middleware.js'
import validate from '#shared/middlewares/validate.middleware.js'
import {
  checkoutSchema,
  orderByUserSchema,
  updateOrderStatusSchema,
  getMyOrdersSchema,
  orderParamSchema
} from '#validations/order.validation.js'
import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('/checkout', grantAccess('create:own', 'ORDER'), validate(checkoutSchema), asyncHandler(orderController.checkoutReview))
Router.post('/', grantAccess('create:own', 'ORDER'), validate(orderByUserSchema), asyncHandler(orderController.orderByUser))
Router.patch('/:orderId/status', grantAccess('update:any', 'ORDER'), validate(updateOrderStatusSchema), asyncHandler(orderController.updateOrderStatusAdmin))
Router.get('/my-orders', grantAccess('read:own', 'ORDER'), validate(getMyOrdersSchema), asyncHandler(orderController.getAllOrderByUser))
Router.get('/my-orders/:orderId', grantAccess('read:own', 'ORDER'), validate(orderParamSchema), asyncHandler(orderController.getOrderDetail))


export const orderRouter = Router
