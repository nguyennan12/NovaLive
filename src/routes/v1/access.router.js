import accessController from '#controllers/access.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import validate from '#middlewares/validate.middleware.js'
import authValidation from '#validations/auth.validation.js'

const Router = express.Router()

Router.post('/signup', validate(authValidation.signUp), asyncHandler(accessController.signUp))
Router.post('/verify', validate(authValidation.verify), asyncHandler(accessController.verify))

export const AccessRouter = Router