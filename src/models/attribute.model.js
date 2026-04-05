
import mongoose from 'mongoose'
const { model, Schema } = mongoose
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'
import { generateAttrId } from '#utils/generator.js'

const attributeSchema = new Schema({
  attr_name: { type: String, required: true },
  attr_id: { type: String, unique: true },
  attr_type: {
    type: String,
    enum: ['text', 'number', 'select', 'multi-select'],
    default: 'text'
  },
  attr_options: { type: [String], default: [] },
  attr_unit: { type: String },
  isRequired: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, {
  timestamps: true,
  collection: COLLECTION_NAME.ATTRIBUTE
})

attributeSchema.pre('save', async function () {
  if (!this.attr_id) {
    this.attr_id = generateAttrId()
  }
})

const attributeModel = model(DOCUMENT_NAME.ATTRIBUTE, attributeSchema)

export default attributeModel