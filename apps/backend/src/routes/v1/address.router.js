import addressController from '#controllers/address.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('/', asyncHandler(addressController.creatAddress))
Router.get('/', asyncHandler(addressController.getAllAddresses))
Router.get('/:addressId', asyncHandler(addressController.getAddressDetail))


export const addressRouter = Router