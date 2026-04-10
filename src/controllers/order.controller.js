/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import orderService from '#services/order.service.js'
import { StatusCodes } from 'http-status-codes'

const checkoutReview = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get checkout successfully!',
    metadata: await orderService.checkoutReview({ userId: req.user.userId, reqBody: req.body })
  }).send(res)
}


export default {
  checkoutReview
}