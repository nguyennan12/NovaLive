
import mongoose from 'mongoose'
const { model, Schema } = mongoose
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'

const inventorySchema = new Schema(
  {
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_productId: String,
    inven_skuId: String,

    inven_stock: Number,
    inven_reserved: { type: Number, default: 0 },

    inven_reservations: [
      {
        orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
        quantity: Number,
        createdAt: Date
      }
    ],
    version: Number
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.INVENTORY
  })


const inventoryModel = model(DOCUMENT_NAME.INVENTORY, inventorySchema)

export default inventoryModel