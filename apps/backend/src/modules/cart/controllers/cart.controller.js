/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import cartService from '#modules/cart/services/cart.service.js'
import { StatusCodes } from 'http-status-codes'

const addToCart = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Add to cart successfully!',
    metadata: await cartService.addToCart({ userId: req.user.userId, reqBody: req.body })
  }).send(res)
}
const updateCartItemQuantity = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Update cart successfully!',
    metadata: await cartService.updateCartItemQuantity({ userId: req.user.userId, reqBody: req.body })
  }).send(res)
}
const removeFromCart = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Remove cart successfully!',
    metadata: await cartService.removeFromCart({ userId: req.user.userId, reqBody: req.body })
  }).send(res)
}

const getCart = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get cart successfully!',
    metadata: await cartService.getCart({ userId: req.user.userId })
  }).send(res)
}


export default {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  getCart
}