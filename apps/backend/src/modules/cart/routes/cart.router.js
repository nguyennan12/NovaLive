import cartController from '#modules/cart/controllers/cart.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import express from 'express'
import authentication from '#shared/middlewares/authentication.middleware.js'
import validate from '#shared/middlewares/validate.middleware.js'
import { addToCartSchema, updateCartItemSchema, removeFromCartSchema } from '#validations/cart.validation.js'
import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('', grantAccess('create:own', 'CART'), validate(addToCartSchema), asyncHandler(cartController.addToCart))
Router.patch('', grantAccess('update:own', 'CART'), validate(updateCartItemSchema), asyncHandler(cartController.updateCartItemQuantity))
Router.delete('', grantAccess('delete:own', 'CART'), validate(removeFromCartSchema), asyncHandler(cartController.removeFromCart))
Router.get('', grantAccess('read:own', 'CART'), asyncHandler(cartController.getCart))

export const cartRouter = Router
