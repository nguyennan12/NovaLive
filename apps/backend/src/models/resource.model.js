import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'
import slugify from 'slugify'

const resourceSchema = new Schema({
  src_name: { type: String, required: true },
  src_slug: { type: String, unique: true },
  src_description: { type: String, default: '' },
}, {
  timestamps: true,
  collection: COLLECTION_NAME.RESOURCE
})

resourceSchema.pre('save', async function () {
  this.src_slug = slugify(this.src_name, { lower: true })
})
export default mongoose.model(DOCUMENT_NAME.RESOURCE, resourceSchema)