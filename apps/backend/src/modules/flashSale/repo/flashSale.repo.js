import { flashSaleCampaignModel } from '../models/flashSaleCampaign.model.js'
import { flashSaleItemModel } from '../models/flashSaleItem.model.js'

const findCampaignById = async (campaignId) => {
  return await flashSaleCampaignModel.findById(campaignId).lean()
}

const findActiveCampaign = async () => {
  return await flashSaleCampaignModel
    .findOne({ status: 'active', isDeleted: false })
    .lean()
}

const findItemsByCampaignId = async ({ limit, sort, page, filter }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

  const [items, totalItems] = await Promise.all([
    flashSaleItemModel.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    flashSaleItemModel.countDocuments(filter)
  ])
  return { items, totalItems }
}

export default {
  findCampaignById,
  findActiveCampaign,
  findItemsByCampaignId
}