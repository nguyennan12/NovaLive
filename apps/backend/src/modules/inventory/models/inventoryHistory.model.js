import { Schema, model, Types } from 'mongoose'
import { DOCUMENT_NAME, COLLECTION_NAME } from '#shared/utils/constant.js'

const inventoryHistorySchema = new Schema({
  inven_shopId: { type: Types.ObjectId, ref: DOCUMENT_NAME.SHOP, required: true },
  inven_productId: { type: Types.ObjectId, ref: DOCUMENT_NAME.SPU, required: true },
  inven_skuId: { type: Types.ObjectId, ref: DOCUMENT_NAME.SKU, required: true },
  inven_userId: { type: Types.ObjectId, ref: DOCUMENT_NAME.USER, required: true },
  inven_userEmail: { type: String, required: true },
  inven_type: { type: String, enum: ['IN', 'OUT'], required: true },
  inven_quantity: { type: Number, required: true },
  inven_oldStock: { type: Number, required: true },
  inven_newStock: { type: Number, required: true },
  inven_reason: { type: String, default: '' },
  inven_note: { type: String, default: '' },
  inven_location: { type: String, default: '' }
}, {
  collection: COLLECTION_NAME.INVENTORY_HISTORY,
  timestamps: true
})

export const inventoryHistoryModel = model(DOCUMENT_NAME.INVENTORY_HISTORY, inventoryHistorySchema)
