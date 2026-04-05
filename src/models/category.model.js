
import mongoose from 'mongoose'
const { model, Schema } = mongoose
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'

const categorySchema = new Schema({
  cat_name: { type: String, required: true },
  cat_id: { type: String, required: true },
  cat_slug: { type: String, },
  cat_parentId: { type: String },
  cat_level: { type: Number, default: 1 },
  cat_isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: COLLECTION_NAME.CATEGORY
})

const CategoryModel = model(DOCUMENT_NAME.CATEGORY, categorySchema)

export default CategoryModel