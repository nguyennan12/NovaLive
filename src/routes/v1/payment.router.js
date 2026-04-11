import paymentController from '#controllers/payment.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('/create_url', asyncHandler(paymentController.createPaymentUrl))

export const paymentRouter = Router