import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'


const resourceSchema = new Schema({
  src_name: { type: String, required: true },
  src_slug: { type: String, required: true },
  src_description: { type: String, default: '' },
}, {
  timestamps: true,
  collection: COLLECTION_NAME.RESOURCE
})

export default mongoose.model(DOCUMENT_NAME.RESOURCE, resourceSchema)