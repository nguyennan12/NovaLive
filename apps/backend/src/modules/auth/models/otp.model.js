
import mongoose from 'mongoose'
const { model, Schema } = mongoose
import { DOCUMENT_NAME, COLLECTION_NAME } from '#shared/utils/constant.js'

const otpSchema = new Schema({
  otp_token: { type: String, required: true },
  otp_email: { type: String, required: true },
  otp_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
  expireAt: { type: Date, default: Date.now, expires: 120 }
}, {
  collection: COLLECTION_NAME.OTP,
  timestamps: true
})

const OtpModel = model(DOCUMENT_NAME.OTP, otpSchema)

export default OtpModel