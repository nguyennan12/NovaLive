import accessController from '#modules/auth/controllers/access.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import express from 'express'
import validate from '#shared/middlewares/validate.middleware.js'
import authValidation from '#validations/auth.validation.js'
import authentication from '#shared/middlewares/authentication.middleware.js'

const Router = express.Router()

Router.post('/signup', validate(authValidation.signUp), asyncHandler(accessController.signUp))
Router.post('/verify', validate(authValidation.verify), asyncHandler(accessController.verify))
Router.post('/sendmail', validate(authValidation.sendMail), asyncHandler(accessController.sendMail))
Router.post('/login', validate(authValidation.login), asyncHandler(accessController.login))

Router.use(authentication)

Router.post('/logout', asyncHandler(accessController.logout))
Router.post('/refreshtoken', asyncHandler(accessController.refreshtoken))


export const AccessRouter = Router
