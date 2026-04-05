import { COLLECTION_NAME, DOCUMENT_NAME } from '#utils/constant.js'
import { Schema, model } from 'mongoose'
import slugify from 'slugify'


const skuSchema = new Schema({
  sku_id: { type: String, required: true, unique: true },
  sku_tier_idx: { type: Array, default: [0] },
  sku_default: { type: Boolean, default: false },
  sku_slug: { type: String, default: '' },
  sku_sort: { type: Number, default: 0 },
  sku_price: { type: String, required: true },
  sku_stock: { type: Number, default: 0 },
  sku_spuId: { type: String, required: true, ref: 'Spu' },

  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
  isDeleted: { type: Boolean, default: false }
}, {
  collection: COLLECTION_NAME.SKU,
  timestamps: true
})

//create index for search
skuSchema.index({ sku_name: 'text', sku_description: 'text' })
//document middleware (before save and create)
skuSchema.pre('save', async function () {
  this.sku_slug = slugify(this.sku_id, { lower: true })
})

export const skuModel = model(DOCUMENT_NAME.SKU, skuSchema)
