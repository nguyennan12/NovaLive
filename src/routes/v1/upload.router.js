import uploadController from '#controllers/upload.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import authentication from '#middlewares/authentication.middleware.js'
import express from 'express'

const Router = express.Router()

Router.use(authentication)

Router.post('/product/thumb', asyncHandler(uploadController.uploadProductImage))
Router.post('/multi-product/thumb', asyncHandler(uploadController.uploadMultiProductImage))
Router.post('/user/avatar', asyncHandler(uploadController.uploadAvatar))


export const uploadRouter = Router