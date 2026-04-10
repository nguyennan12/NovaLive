
import { COLLECTION_NAME, DOCUMENT_NAME } from '#utils/constant.js'
import mongoose, { Types } from 'mongoose'
const { model, Schema } = mongoose

const cartSchema = new Schema({
  cart_userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  cart_state: { type: String, enum: ['active', 'pending', 'completed', 'failed'], default: 'active' },
  cart_code: String,
  cart_products: [
    {
      shopId: { type: Types.ObjectId, ref: 'Shop', required: true },
      productId: { type: Types.ObjectId, ref: 'Spu', required: true },
      skuId: { type: Types.ObjectId, ref: 'Sku', required: true },
      name: String,
      thumb: String,
      price: Number,
      quantity: { type: Number, required: true, min: 1 },
      liveId: { type: Schema.Types.ObjectId, ref: 'LiveSession', default: null },
      is_gift: { type: Boolean, default: false },
    }
  ],
  cart_count_product: { type: Number, default: 0 }

}, {
  timestamps: true,
  collection: COLLECTION_NAME.CART
})

const cartModel = model(DOCUMENT_NAME.CART, cartSchema)

export default cartModel