import paymentController from '#controllers/payment.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.get('/vnpay_return', asyncHandler(paymentController.vnpayReturn))
Router.get('/vnpay_ipn', asyncHandler(paymentController.vnpayIpn))
Router.use(authentication)
Router.post('/create_url', asyncHandler(paymentController.createPaymentUrl))
Router.post('/cod', asyncHandler(paymentController.confirmCodPayment))


export const paymentRouter = Router