import { Schema, Types, model } from 'mongoose'
import { DOCUMENT_NAME, COLLECTION_NAME } from '#shared/utils/constant.js'
import slugify from 'slugify'

const spuSchema = new Schema({
  spu_name: { type: String, required: true },
  spu_code: { type: String, default: '' },
  spu_thumb: { type: String, required: true },
  spu_description: { type: String },
  spu_slug: { type: String },
  spu_price: { type: Number, required: true, min: [0, 'price invalid'] },
  spu_quantity: { type: Number, required: true, min: [0, 'price invalid'] },
  spu_category: [{ type: String, ref: 'Category' }],
  total_sold: { type: Number, default: 0 },
  spu_ratingsAvg: {
    type: Number,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be above 5.0'],
    set: (val) => Math.round(val * 10) / 10
  },
  spu_shopId: { type: Types.ObjectId, ref: 'Shop' },
  spu_attributes: [
    {
      attr_id: { type: String, ref: 'Attribute' },
      attr_name: String,
      attr_value: [String]
    }
  ],

  spu_variations: { type: Array, default: [] },
  isDraft: { type: Boolean, default: true, index: true },
  isPublished: { type: Boolean, default: false, index: true },
  isDeleted: { type: Boolean, default: false }
}, {
  collection: COLLECTION_NAME.SPU,
  timestamps: true
})


//document middleware (before save and create)
spuSchema.pre('save', async function () {
  this.spu_slug = slugify(this.spu_name, { lower: true })
})

export const spuModel = model(DOCUMENT_NAME.SPU, spuSchema)
