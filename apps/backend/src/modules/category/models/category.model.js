
import mongoose from 'mongoose'
const { model, Schema } = mongoose
import { DOCUMENT_NAME, COLLECTION_NAME } from '#shared/utils/constant.js'
import slugify from 'slugify'

const categorySchema = new Schema({
  cat_name: { type: String, required: true },
  cat_id: { type: String, required: true, unique: true },
  cat_slug: { type: String, unique: true },
  cat_parentId: { type: String },
  cat_level: { type: Number, default: 1 },
  cat_attributes: [
    {
      attr_id: { type: String, required: true },
      isRequired: { type: Boolean, default: false },
      displayOrder: { type: Number, default: 0 },
    }
  ],
  cat_isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: COLLECTION_NAME.CATEGORY
})

categorySchema.pre('save', function () {
  this.cat_slug = slugify(this.cat_name, { lower: true, locale: 'vi' })
})

const CategoryModel = model(DOCUMENT_NAME.CATEGORY, categorySchema)

export default CategoryModel