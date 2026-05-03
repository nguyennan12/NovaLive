/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import orderService from '#modules/order/services/order.service.js'
import { StatusCodes } from 'http-status-codes'

const checkoutReview = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get checkout successfully!',
    metadata: await orderService.checkoutReview({ userId: req.user.userId, reqBody: req.body })
  }).send(res)
}
const orderByUser = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Order successfully!',
    metadata: await orderService.orderByUser({ userId: req.user.userId, reqBody: req.body })
  }).send(res)
}
const getAllOrderByUser = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get orders successfully!',
    metadata: await orderService.getAllOrderByUser({ userId: req.user.userId, status: req.query.status })
  }).send(res)
}

const getOrderDetail = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get orders successfully!',
    metadata: await orderService.getOrderDetail({ userId: req.user.userId, orderId: req.params.orderId })
  }).send(res)
}
const updateOrderStatusAdmin = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Update order successfully!',
    metadata: await orderService.updateOrderStatusAdmin({ orderId: req.params.orderId, newStatus: req.body.status })
  }).send(res)
}


export default {
  checkoutReview,
  orderByUser,
  getAllOrderByUser,
  getOrderDetail,
  updateOrderStatusAdmin
}