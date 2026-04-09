import cartController from '#controllers/cart.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('', asyncHandler(cartController.addToCart))



export const cartRouter = Router