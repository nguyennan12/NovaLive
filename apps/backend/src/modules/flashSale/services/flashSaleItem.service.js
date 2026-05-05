import ApiError from '#shared/core/error.response.js'
import { StatusCodes } from 'http-status-codes'
import flashSaleRepo from '../routers/flashSale.repo.js'
import { flashSaleItemModel } from '../models/flashSaleItem.model'
import inventoryModel from '#modules/inventory/models/inventory.model'

const addItemToCampaign = async ({ campaignId, items }) => {
  const { original_price, flashsale_price, flashsale_stock, sku_id } = items

  const campaign = await flashSaleRepo.findCampaignById(campaignId)
  if (!campaign || campaign.status === 'active' || campaign.status === 'completed') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Campaign invalid')
  }
  if (flashsale_price >= original_price) throw new ApiError(StatusCodes.BAD_REQUEST, 'Flash sale price must less than orginal price')

  const foundStock = await inventoryModel.findOne({ inven_skuId: sku_id }).select('inven_stock').lean()
  if (flashsale_stock >= foundStock.inven_stock) throw new ApiError(StatusCodes.BAD_REQUEST, 'Stock is not enough!')

  const newItem = await flashSaleItemModel.create({
    ...itemPayload,
    campaignId: campaign._id,
    flashsale_sold: 0,
    status: 'active'
  })

  return newItem
}

export default {
  addItemToCampaign
}