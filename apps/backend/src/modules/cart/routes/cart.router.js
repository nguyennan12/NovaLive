import cartController from '#modules/cart/controllers/cart.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import express from 'express'
import authentication from '#shared/middlewares/authentication.middleware.js'

import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('', grantAccess('create:own', 'CART'), asyncHandler(cartController.addToCart))
Router.patch('', grantAccess('update:own', 'CART'), asyncHandler(cartController.updateCartItemQuantity))
Router.delete('', grantAccess('delete:own', 'CART'), asyncHandler(cartController.removeFromCart))
Router.get('', grantAccess('read:own', 'CART'), asyncHandler(cartController.getCart))

export const cartRouter = Router