
import mongoose, { Types } from 'mongoose'
const { model, Schema } = mongoose
import { DOCUMENT_NAME, COLLECTION_NAME } from '#utils/constant.js'

const orderSchema = new Schema(
  {
    order_userId: { type: Types.ObjectId, required: true, ref: 'User' },
    order_code: String,
    order_checkout: {
      totalPrice: { Type: Number, default: 0 },
      totalApplyDiscount: { type: Number, default: 0 },
      feeShip: { type: Number, default: 0 },
      finalCheckoutL: { type: Number, default: 0 }
    },
    order_shipping: {
      street: String,
      city: String,
      state: String,
      country: String
    },
    order_payment: {
      method: { type: String, enum: ['cod', 'vnpay', 'stripe', 'momo'], default: 'cod' },
      paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
    },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String },
    order_status: {
      type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.ORDER
  })


const orderModel = model(DOCUMENT_NAME.ORDER, orderSchema)

export default orderModel