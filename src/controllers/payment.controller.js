/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import paymentService from '#services/payment.service.js'
import { StatusCodes } from 'http-status-codes'

const createPaymentUrl = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Create payment successfully!',
    metadata: await paymentService.createPaymentUrl({ reqBody: req.body })
  }).send(res)
}


export default {
  createPaymentUrl
}