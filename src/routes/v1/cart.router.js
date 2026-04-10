import cartController from '#controllers/cart.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('', asyncHandler(cartController.addToCart))
Router.patch('', asyncHandler(cartController.updateCartItemQuantity))
Router.delete('', asyncHandler(cartController.removeFromCart))
Router.get('', asyncHandler(cartController.getCart))

export const cartRouter = Router