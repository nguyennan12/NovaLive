import { flashSaleCampaignModel } from '../models/flashSaleCampaign.model.js'

const findCampaignById = async (campaignId) => {
  return await flashSaleCampaignModel.findById(campaignId).lean()
}

export default {
  findCampaignById
}