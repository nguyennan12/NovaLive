
import mongoose from 'mongoose'
const { model, Schema } = mongoose
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'

const inventorySchema = new Schema(
  {
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_productId: String,
    inven_skuId: String,

    inven_stock: Number,
    inven_reserved: Number,

    inven_reservations: [
      {
        orderId: String,
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