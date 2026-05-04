import addressController from '#modules/address/controllers/address.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import express from 'express'
import authentication from '#shared/middlewares/authentication.middleware.js'
import validate from '#shared/middlewares/validate.middleware.js'
import { createAddressSchema } from '#validations/address.validation.js'
import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('/', grantAccess('create:own', 'ADDRESS'), validate(createAddressSchema), asyncHandler(addressController.creatAddress))
Router.get('/', grantAccess('read:own', 'ADDRESS'), asyncHandler(addressController.getAllAddresses))
Router.get('/:addressId', grantAccess('read:own', 'ADDRESS'), asyncHandler(addressController.getAddressDetail))


export const addressRouter = Router
