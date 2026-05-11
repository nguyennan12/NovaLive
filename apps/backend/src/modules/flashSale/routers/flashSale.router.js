import flashSaleController from '../controllers/flashSale.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import authentication from '#shared/middlewares/authentication.middleware.js'
import express from 'express'
import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()

Router.get('/active', asyncHandler(flashSaleController.getActiveCampaign))
Router.get('/items/:campaignId', asyncHandler(flashSaleController.getItemsFlashSale))
Router.get('/:campaignId', asyncHandler(flashSaleController.getCampaign))

Router.use(authentication)
Router.post('/', grantAccess('create:any', 'FLASH_SALE'), asyncHandler(flashSaleController.createCampaign))
Router.post('/items/:campaignId', grantAccess('create:any', 'FLASH_SALE'), asyncHandler(flashSaleController.addItemToCampaign))


export const flashSaleRouter = Router