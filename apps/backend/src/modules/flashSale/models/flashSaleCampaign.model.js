import { Schema, model } from 'mongoose'
import { DOCUMENT_NAME, COLLECTION_NAME } from '#shared/utils/constant.js'

const flashSaleCampaignSchema = new Schema({
  campaign_name: { type: String, required: true },
  campaign_description: { type: String, default: '' },
  campaign_banner: { type: String, default: '' },

  start_time: { type: Date, required: true, index: true },
  end_time: { type: Date, required: true, index: true },

  status: {
    type: String,
    enum: ['draft', 'upcomming', 'active', 'completed', 'cancelled'],
    default: 'draft',
    index: true
  },
  isPublish: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, {
  collection: COLLECTION_NAME.FLASHSALE_CAMPAIGN,
  timestamps: true
})

flashSaleCampaignSchema.index({ status: 1, start_time: 1, end_time: 1 })

export const flashSaleCampaignModel = model(DOCUMENT_NAME.FLASHSALE_CAMPAIGN, flashSaleCampaignSchema)