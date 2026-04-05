import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'
import adminController from '#controllers/admin.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'

const Router = express.Router()

Router.use(authentication)

Router.post('/attribute', asyncHandler(adminController.createAttributeBulk))
Router.post('/category', asyncHandler(adminController.createCategoryBulk))

export const BulkRouter = Router