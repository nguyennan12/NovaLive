/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import cartService from '#services/cart.service.js'
import { StatusCodes } from 'http-status-codes'

const addToCart = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Add to cart successfully!',
    metadata: await cartService.addToCart({ userId: req.user.userId, reqBody: req.body })

  }).send(res)
}

export default {
  addToCart
}