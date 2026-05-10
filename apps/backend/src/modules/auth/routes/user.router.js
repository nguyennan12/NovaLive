import userController from '#modules/auth/controllers/user.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import authentication from '#shared/middlewares/authentication.middleware.js'
import validate from '#shared/middlewares/validate.middleware.js'
import userValidation from '#validations/user.validation.js'
import express from 'express'

const Router = express.Router()

Router.use(authentication)

Router.get('/me', asyncHandler(userController.getMe))
Router.patch('/me', validate(userValidation.updateMe), asyncHandler(userController.updateMe))

export const userRouter = Router
