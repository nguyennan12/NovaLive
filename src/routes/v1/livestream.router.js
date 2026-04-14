import livestreamController from '#controllers/livestream.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import authentication from '#middlewares/authentication.middleware.js'
import express from 'express'

const Router = express.Router()

Router.use(authentication)

Router.post('/', asyncHandler(livestreamController.createLiveSession))
Router.post('/:liveId/start', asyncHandler(livestreamController.startLive))
Router.post('/:liveId/end', asyncHandler(livestreamController.endLive))
Router.patch('/:liveId/pin', asyncHandler(livestreamController.pinProduct))
Router.patch('/:liveId/unpin', asyncHandler(livestreamController.unpinProduct))

export const livestreamRouter = Router