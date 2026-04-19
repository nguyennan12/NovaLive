import ApiError from '#core/error.response.js'
import { redisClient } from '#database/init.redis.js'
import authHelper from '#helpers/auth.helper.js'
import OtpModel from '#models/otp.model.js'
import userRepo from '#models/repository/user.repo.js'
import { PREFIX, REFRESHTOKEN_LIFE } from '#utils/constant.js'
import converter from '#utils/converter.js'
import data from '#utils/data.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import emailService from './email.service.js'
import tokenService from './token.service.js'

const SignUp = async ({ email, password }) => {
  const foundUser = await userRepo.findUserByEmail({ email })
  if (foundUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exists!')

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = await userRepo.createUser({ email, password: passwordHash })
  if (!newUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'Register user error')

  //send email
  emailService.sendVerificationEmail({ email: newUser.user_email }).catch(console.error)

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
  })

  //tạo accessToken voi refreshToken
  const tokens = await authHelper.createTokenPair({ userId: newUser._id, email }, publicKey, privateKey)
  //lưu token vào db
  await tokenService.createKeyStore({
    userId: newUser._id,
    publicKey,
    privateKey,
    refreshToken: tokens.refreshToken
  })
  return {
    user: data.getInfo(['_id', 'user_name', 'user_email'], newUser),
    tokens
  }
}

const verify = async ({ email, otpToken }) => {
  const foundUser = await userRepo.findUserByEmail({ email })
  if (!foundUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'Account not found!')
  //found lastOTP
  const lastOtpToken = await OtpModel.findOne({ otp_email: email }).sort({ createdAt: -1 })
  if (!lastOtpToken || lastOtpToken.otp_token != otpToken) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP code!')
  //change status
  const user = await userRepo.changeStatus({ email, status: 'active' })
  //remove otp
  await OtpModel.deleteOne({ _id: converter.toObjectId(lastOtpToken._id) })

  return {
    user: data.getInfo(['_id', 'user_email', 'user_status'], user)
  }
}

const login = async ({ email, password }) => {
  console.log('🚀 ~ login ~ password:', password)
  console.log('🚀 ~ login ~ email:', email)
  const foundUser = await userRepo.findUserByEmail({ email })
  if (!foundUser || foundUser.user_status !== 'active') throw new ApiError(StatusCodes.BAD_REQUEST, 'Account not found!')

  const matchPassword = await bcrypt.compare(password, foundUser.user_password)
  if (!matchPassword) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication error')

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
  })

  //tạo accessToken voi refreshToken
  const tokens = await authHelper.createTokenPair(
    {
      userId: foundUser._id, email, role: foundUser.user_role, shopId: foundUser.user_shop ? foundUser.user_shop : null
    },
    publicKey, privateKey)
  //lưu role vào redis
  await redisClient.set(`${PREFIX.USER_RULE}:${foundUser._id}`, foundUser.user_role, { EX: REFRESHTOKEN_LIFE })
  //lưu token vào db
  await tokenService.createKeyStore({
    userId: foundUser._id,
    publicKey,
    privateKey,
    refreshToken: tokens.refreshToken
  })
  return {
    user: data.getInfo(['_id', 'user_name', 'user_email'], foundUser),
    tokens
  }
}

const logout = async ({ keyStore }) => {
  if (!keyStore?._id) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid keyStore')
  return await tokenService.deleteKeyStoreById(keyStore._id)
}

const refreshtoken = async ({ refreshToken, user, keyStore }) => {
  if (!refreshToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
  if (keyStore.refreshToken !== refreshToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not registeted')
  const { userId, email, role } = user
  //kiểm tra xem refresh token dc sử dụng chưa, nếu r thì xóa toàn bộ keyStore của user đó
  if (keyStore.refreshTokenUsed.includes(refreshToken)) {
    await tokenService.deleteKeyStoreByUserId(userId)
    throw new ApiError(StatusCodes.FORBIDDEN, 'Something wrong happen! please relogin')
  }
  //maybe có user r khỏi check có tồn tại k
  //tạo cặnp token mới
  const tokens = await authHelper.createTokenPair({ userId, email, role }, keyStore.publicKey, keyStore.privateKey)
  await tokenService.updateRefreshToken({ oldRefreshToken: refreshToken, newRefreshToken: tokens.refreshToken })
  return {
    user: data.getInfo(['userId', 'email'], user),
    tokens
  }
}


export default {
  SignUp,
  verify,
  login,
  logout,
  refreshtoken
}