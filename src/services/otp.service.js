import OtpModel from '#models/otp.model.js'
import crypto from 'crypto'

const createOtp = async ({ email }) => {
  const tokenOtp = crypto.randomInt(100000, 999999)
  return await OtpModel.create({ otp_token: tokenOtp, otp_email: email })
}

export default {
  createOtp
}