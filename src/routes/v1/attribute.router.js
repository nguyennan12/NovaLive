import attributeController from '#controllers/attribute.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)

Router.post('', asyncHandler(attributeController.createAttribute))
Router.post('/bulk', asyncHandler(attributeController.createAttributeBulk))

export const attributeRouter = Router