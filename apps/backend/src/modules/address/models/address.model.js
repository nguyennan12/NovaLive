import { Schema, model } from 'mongoose'
import { DOCUMENT_NAME, COLLECTION_NAME } from '#shared/utils/constant.js'

const addressSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, required: true, index: true },
  owner_type: { type: String, enum: ['user', 'shop'], required: true },
  owner_phone: { type: String, default: '' },
  owner_name: { type: String, default: '' },
  street: { type: String, required: true },
  ward: { type: String, required: true },
  fullAddress: { type: String },
  district: { type: String, required: true },
  province: { type: String, required: true },
  province_id: { type: Number, required: true },
  district_id: { type: Number, required: true },
  ward_code: { type: String, required: true },
  is_default: { type: Boolean, default: false }
}, {
  collection: COLLECTION_NAME.ADDRESS,
  timestamps: true
})

addressSchema.index({ owner_id: 1, is_default: -1 })

export const addressModel = model(DOCUMENT_NAME.ADDRESS, addressSchema)