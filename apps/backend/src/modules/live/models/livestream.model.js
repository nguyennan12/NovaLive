
import mongoose from 'mongoose'
const { model, Schema } = mongoose
import { DOCUMENT_NAME, COLLECTION_NAME } from '#shared/utils/constant.js'

const livestreamSchema = new Schema({
  live_title: { type: String, required: true },
  live_description: { type: String },
  live_code: { type: String },
  live_shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  live_streamerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  live_thumb: { type: String },

  live_status: { type: String, enum: ['scheduled', 'live', 'ended', 'cancelled'], default: 'scheduled' },

  live_products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    thumb: String,
    is_featured: { type: Boolean, default: false },
    skus: [{
      skuId: { type: Schema.Types.ObjectId, ref: 'Sku', required: true },
      sku_name: String,
      original_price: { type: Number },
      live_price: { type: Number, required: true },
    }]
  }],
  live_pinnedProduct: { type: Schema.Types.ObjectId, ref: 'Spu', default: null },
  live_metrics: {
    viewer_count: { type: Number, default: 0 },//so view hien tai
    peak_viewers: { type: Number, default: 0 },//view cao nhat
    total_likes: { type: Number, default: 0 },
    total_orders: { type: Number, default: 0 },
    total_revenue: { type: Number, default: 0 } //doanh thu
  },
  live_schedule_at: { type: Date },
  live_actual_start: { type: Date },
  live_actual_end: { type: Date }
}, {
  timestamps: true,
  collection: COLLECTION_NAME.LIVESTREAM
})


const livestreamModel = model(DOCUMENT_NAME.LIVESTREAM, livestreamSchema)

export default livestreamModel