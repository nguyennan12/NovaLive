import { Schema, Types, model } from 'mongoose'
import { DOCUMENT_NAME, COLLECTION_NAME } from '#shared/utils/constant.js'

const flashSaleItemSchema = new Schema({
  campaignId: { type: Types.ObjectId, ref: 'FlashSaleCampaign', required: true, index: true },

  spu_id: { type: Types.ObjectId, ref: 'Spu', required: true },
  sku_id: { type: Types.ObjectId, ref: 'Sku', required: true },

  spu_name: { type: String, required: true },
  spu_code: { type: String, default: '' },
  spu_thumb: { type: String, required: true },

  original_price: { type: Number, required: true },
  flashsale_price: { type: Number, required: true },

  flashsale_stock: { type: Number, required: true },
  flashsale_sold: { type: Number, default: 0 },

  status: { type: String, enum: ['active', 'inactive', 'sold_out'], default: 'active' },
}, {
  collection: COLLECTION_NAME.FLASHSALE_ITEM,
  timestamps: true,
  optimisticConcurrency: true
})

flashSaleItemSchema.index({ campaignId: 1, status: 1 })

export const flashSaleItemModel = model(DOCUMENT_NAME.FLASHSALE_ITEM, flashSaleItemSchema)