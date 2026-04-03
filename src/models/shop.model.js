import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'
import data from '#utils/data.js'

export const shopAddressSchema = new Schema({
  street: String,
  province_id: Number,
  province_name: String,
  district_id: Number,
  district_name: String,
  ward_name: String,
  full_address: String
}, { _id: false })


const shopSchema = new Schema({
  shop_owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  shop_name: { type: String, required: true, trim: true },
  //co the cho field ccnd để xác thực, và tài khoản bank
  shop_slug: { type: String, unique: true, index: true },
  shop_logo: { type: String, default: '' },
  current_live_session: { type: Schema.Types.ObjectId, ref: 'LiveSession', default: null },

  shop_address: shopAddressSchema,

  shop_status: { type: String, enum: ['active', 'inactive', 'banned', 'warning'], default: 'active', index: true },
  shop_contact: { phone: String, email: String },

  shop_metrics: {
    rating_avg: { type: Number, default: 0, min: 0, max: 5 },
    rating_count: { type: Number, default: 0 },
    total_products: { type: Number, default: 0 },
    total_sold: { type: Number, default: 0 },
    response_time: String,
    follower_count: { type: Number, default: 0 }
  },

  shop_settings: {
    is_vacation: { type: Boolean, default: false },
    auto_msg: { type: String, default: '' }
  },
  isDeleted: { type: Boolean, default: false }

}, {
  timestamps: true,
  collection: COLLECTION_NAME.SHOP
})
shopSchema.pre('save', async function () {
  if (this.isModified('shop_name') || !this.shop_slug) {
    this.shop_slug = await data.generateUniqueSlug(this.shop_name, mongoose.models.Shop)
  }
})

export default mongoose.model(DOCUMENT_NAME.SHOP, shopSchema)