
import mongoose from 'mongoose'
const { model, Schema } = mongoose
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'

const inventorySchema = new Schema(
  {
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_productId: { type: Schema.Types.ObjectId, ref: 'Spu' },
    inven_skuId: { type: Schema.Types.ObjectId, ref: 'Sku' },
    inven_location: { type: String, default: '' },
    inven_stock: Number,
    inven_reserved: { type: Number, default: 0 },
    inven_reservations: [
      {
        orderId: { type: String },
        quantity: Number,
        createdAt: Date
      }
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.INVENTORY
  })


const inventoryModel = model(DOCUMENT_NAME.INVENTORY, inventorySchema)

export default inventoryModel