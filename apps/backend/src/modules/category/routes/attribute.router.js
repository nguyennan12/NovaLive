import attributeController from '#modules/category/controllers/attribute.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import express from 'express'
import authentication from '#shared/middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)

Router.post('', asyncHandler(attributeController.createAttribute))
Router.post('/bulk', asyncHandler(attributeController.createAttributeBulk))

export const attributeRouter = Router