/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import paymentService from '#modules/payment/services/payment.service.js'
import { StatusCodes } from 'http-status-codes'

const createPaymentUrl = async (req, res, next) => {
  // lấy ip của user hiện tại gáng mặc định
  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Create payment successfully!',
    metadata: await paymentService.createPaymentUrl({ reqBody: req.body, ipAddr })
  }).send(res)
}
const vnpayReturn = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Return payment successfully!',
    metadata: await paymentService.vnpayReturn(req.query)
  }).send(res)
}
const vnpayIpn = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Vnp Ipn successfully!',
    metadata: await paymentService.vnpayIpn(req.query)
  }).send(res)
}
const confirmCodPayment = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Confirm cod payment successfully!',
    metadata: await paymentService.confirmCodPayment(req.body)
  }).send(res)
}


export default {
  createPaymentUrl,
  vnpayReturn,
  vnpayIpn,
  confirmCodPayment
}