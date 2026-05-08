/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import flashSaleCampaignService from '../services/flashSaleCampaign.service.js'
import flashSaleItemService from '../services/flashSaleItem.service.js'

const createCampaign = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create Campaing successfully!',
    metadata: await flashSaleCampaignService.createCampaign(req.body)
  }).send(res)
}
const addItemToCampaign = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Add item to Campaing successfully!',
    metadata: await flashSaleItemService.addItemToCampaign({ campaignId: req.params.campaignId, items: req.body })
  }).send(res)
}
const getItemsFlashSale = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get Items flashsale successfully!',
    metadata: await flashSaleItemService.getItemsFlashSale(req.params.campaignId)
  }).send(res)
}
const getCampaign = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get Campaing successfully!',
    metadata: await flashSaleCampaignService.getCampaign(req.params.campaignId)
  }).send(res)
}

export default {
  createCampaign,
  addItemToCampaign,
  getItemsFlashSale,
  getCampaign
}