import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'


const userSchema = new Schema({
  user_slug: { type: String, required: true },
  user_name: { type: String, required: true },
  user_password: { type: String, required: true },
  user_salt: { type: String, default: '' },
  user_email: { type: String, required: true },
  user_phone: { type: String, default: '' },
  user_sex: { type: String, default: '' },
  user_avatar: { type: String, default: '' },
  user_date_of_birth: { type: Date, default: null },
  user_role: { type: Schema.Types.ObjectId, ref: 'Role' },
  user_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },

  user_is_seller: { type: Boolean, default: false },
  user_shop: { type: Schema.Types.ObjectId, ref: 'Shop', default: null },

}, {
  timestamps: true,
  collection: COLLECTION_NAME.USER
})

export const UserModel = mongoose.model(DOCUMENT_NAME.USER, userSchema)