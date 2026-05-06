import livestreamController from '#modules/live/controllers/livestream.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import authentication from '#shared/middlewares/authentication.middleware.js'
import express from 'express'
import validate from '#shared/middlewares/validate.middleware.js'
import { createLiveSessionSchema, updateLiveSessionSchema, pinProductSchema, addProductsToLiveSchema, liveChartQuerySchema } from '#validations/livestream.validation.js'
import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)

Router.post('/', grantAccess('create:own', 'LIVESTREAM'), validate(createLiveSessionSchema), asyncHandler(livestreamController.createLiveSession))
Router.get('/active', grantAccess('read:any', 'LIVESTREAM'), asyncHandler(livestreamController.getActiveSessions))
Router.patch('/:liveId', grantAccess('update:own', 'LIVESTREAM'), validate(updateLiveSessionSchema), asyncHandler(livestreamController.updateLiveSession))
Router.post('/:liveId/start', grantAccess('update:own', 'LIVESTREAM'), asyncHandler(livestreamController.startLive))
Router.post('/:liveId/join', grantAccess('read:any', 'LIVESTREAM'), asyncHandler(livestreamController.joinLive))
Router.post('/:liveId/end', grantAccess('update:own', 'LIVESTREAM'), asyncHandler(livestreamController.endLive))
Router.patch('/:liveId/pin', grantAccess('update:own', 'LIVESTREAM'), validate(pinProductSchema), asyncHandler(livestreamController.pinProduct))
Router.patch('/:liveId/unpin', grantAccess('update:own', 'LIVESTREAM'), asyncHandler(livestreamController.unpinProduct))
Router.post('/:liveId/product', grantAccess('update:own', 'LIVESTREAM'), validate(addProductsToLiveSchema), asyncHandler(livestreamController.addProductToLiveSession))
Router.delete('/:liveId/product/:productId', grantAccess('update:own', 'LIVESTREAM'), asyncHandler(livestreamController.removeProductFromLiveSession))
Router.patch('/:liveId/cancel', grantAccess('update:own', 'LIVESTREAM'), asyncHandler(livestreamController.cancelLiveSession))
Router.get('/:liveId', grantAccess('read:own', 'LIVESTREAM'), asyncHandler(livestreamController.getLiveById))
Router.get('/history', grantAccess('read:own', 'LIVESTREAM'), asyncHandler(livestreamController.getHistoryLiveByShop))
Router.get('/upcomming', grantAccess('read:any', 'LIVESTREAM'), asyncHandler(livestreamController.getUpommingLiveSessions))
Router.get('/stats', grantAccess('read:own', 'LIVESTREAM'), asyncHandler(livestreamController.getLiveStats))
Router.get('/chart', grantAccess('read:own', 'LIVESTREAM'), validate(liveChartQuerySchema), asyncHandler(livestreamController.getLiveRevenueChart))

export const livestreamRouter = Router
