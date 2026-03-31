import mongoose from 'mongoose'
import { COLLECTION_NAME, DOCUMENT_NAME } from '#utils/constant.js'

const { Schema } = mongoose

const keyTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true },
  refreshTokenUsed: { type: Array, default: [] },
  refreshToken: { type: String, required: true }
}, {
  timestamps: true,
  collection: COLLECTION_NAME.TOKEN
})

export default mongoose.model(DOCUMENT_NAME.TOKEN, keyTokenSchema)

