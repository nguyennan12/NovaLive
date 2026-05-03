import uploadController from '#modules/common/controllers/upload.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import authentication from '#shared/middlewares/authentication.middleware.js'
import express from 'express'
import uploadCloud from '#infrastructure/config/cloudinary.config.js'

const Router = express.Router()

Router.use(authentication)

Router.post('/product/thumb', uploadCloud.single('file'), asyncHandler(uploadController.uploadProductImage))
Router.post('/multi-product/thumb', uploadCloud.array('files', 10), asyncHandler(uploadController.uploadMultiProductImage))
Router.post('/user/avatar', uploadCloud.single('file'), asyncHandler(uploadController.uploadAvatar))


export const uploadRouter = Router