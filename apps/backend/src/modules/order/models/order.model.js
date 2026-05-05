
import mongoose, { Types } from 'mongoose'
const { model, Schema } = mongoose
import { DOCUMENT_NAME, COLLECTION_NAME } from '#shared/utils/constant.js'

const orderSchema = new Schema(
  {
    order_userId: { type: Types.ObjectId, required: true, ref: 'User' },
    order_checkout: {
      totalPrice: { type: Number, default: 0 },
      totalDiscount: { type: Number, default: 0 },
      feeShip: { type: Number, default: 0 },
      finalCheckout: { type: Number, default: 0 }
    },
    order_shipping: { type: String, required: true },
    order_payment: {
      method: { type: String, enum: ['cod', 'vnpay', 'stripe', 'momo'], default: 'cod' },
      paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
    },
    order_products: [
      {
        productId: { type: Types.ObjectId, ref: 'Spu' },
        skuId: { type: Types.ObjectId, ref: 'Sku' },
        quantity: Number
      }
    ],
    order_appliedDiscountCodes: { type: [String], default: [] },
    order_trackingNumber: { type: String },
    order_status: {
      type: String, enum: ['pending', 'processing', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'
    },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.ORDER
  })


const orderModel = model(DOCUMENT_NAME.ORDER, orderSchema)

export default orderModel