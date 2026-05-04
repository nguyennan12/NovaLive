import paymentController from '#modules/payment/controllers/payment.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import express from 'express'
import authentication from '#shared/middlewares/authentication.middleware.js'
import validate from '#shared/middlewares/validate.middleware.js'
import { createPaymentUrlSchema, confirmCodSchema } from '#validations/payment.validation.js'

const Router = express.Router()

Router.get('/vnpay_return', asyncHandler(paymentController.vnpayReturn))
Router.get('/vnpay_ipn', asyncHandler(paymentController.vnpayIpn))

Router.use(authentication)
Router.post('/create_url', validate(createPaymentUrlSchema), asyncHandler(paymentController.createPaymentUrl))
Router.post('/cod', validate(confirmCodSchema), asyncHandler(paymentController.confirmCodPayment))


export const paymentRouter = Router
