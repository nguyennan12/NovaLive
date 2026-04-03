import { Schema, Types, model } from 'mongoose'
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'
import slugify from 'slugify'

const productSchema = new Schema({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: { type: String },
  product_slug: { type: String },
  product_price: { type: Number, required: true, min: [0, 'price invalid'] },
  product_quantity: { type: Number, required: true, min: [1, 'price invalid'] },
  product_type: {
    type: String, required: true,
    enum: ['Product', 'Electronic', 'Clothing', 'Furniture', 'Cosmetics', 'Food', 'Book']
  },
  product_ratingsAvg: {
    type: Number,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be above 5.0'],
    set: (val) => Math.round(val * 10) / 10
  },
  product_shopId: { type: Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, required: true },
  product_variations: { type: Array, default: [] },
  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
  collection: COLLECTION_NAME.PRODUCT,
  timestamps: true
})

//create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })
//document middleware (before save and create)
productSchema.pre('save', async function () {
  this.product_slug = slugify(this.product_name, { lower: true })
})

const clothingSchema = new Schema({
  brand: { type: String, required: true, index: true },
  size: {
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    required: true
  },
  material: { type: String, required: true },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unisex', 'Kids'],
    default: 'Unisex'
  },
  product_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
  collection: COLLECTION_NAME.CLOTHING,
  timestamps: true
})


const electronicSchema = new Schema({
  manufacturer: { type: String, required: true, index: true },
  model_name: { type: String, required: true },
  color: String,
  warranty_duration: { type: Number, default: 12 },
  specs: { type: Schema.Types.Mixed },
  product_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
  collection: COLLECTION_NAME.ELECTRONIC,
  timestamps: true
})

const furnitureSchema = new Schema({
  brand: { type: String, required: true },
  size: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' }
  },
  material: { type: String, required: true },
  weight: { type: Number },
  is_assembly_required: { type: Boolean, default: false },
  product_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
  collection: COLLECTION_NAME.FURNITURE,
  timestamps: true
})

const cosmeticsSchema = new Schema({
  brand: { type: String, required: true },
  volume: { type: String, required: true },
  skin_type: {
    type: String,
    enum: ['All', 'Oily', 'Dry', 'Sensitive', 'Combination'],
    default: 'All'
  },
  ingredients: [String],
  expiry_date: Date,
  is_vegan: { type: Boolean, default: false }
}, {
  collection: COLLECTION_NAME.COSMETICS,
  timestamps: true
})

const foodSchema = new Schema({
  brand: { type: String, required: true },
  weight: String,
  origin: String,
  nutrition_facts: {
    calories: Number,
    fat: Number,
    protein: Number
  },
  storage_instructions: String,
  certification: [String]
}, {
  collection: COLLECTION_NAME.FOOD,
  timestamps: true
})

const bookSchema = new Schema({
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  publisher: String,
  publish_date: Date,
  language: { type: String, default: 'Vietnamese' },
  num_pages: Number,
  format: { type: String, enum: ['Hardcover', 'Paperback', 'E-book'] }
}, {
  collection: COLLECTION_NAME.BOOK,
  timestamps: true
})

export const ProductModel = model(DOCUMENT_NAME.PRODUCT, productSchema)
export const ClothingtModel = model(DOCUMENT_NAME.CLOTHING, clothingSchema)
export const ElectronicModel = model(DOCUMENT_NAME.ELECTRONIC, electronicSchema)
export const FurnitureModel = model(DOCUMENT_NAME.FURNITURE, furnitureSchema)
export const CosmeticsModel = model(DOCUMENT_NAME.COSMETICS, cosmeticsSchema)
export const FoodModel = model(DOCUMENT_NAME.FOOD, foodSchema)
export const BookModel = model(DOCUMENT_NAME.BOOK, bookSchema)

