import ApiError from '#core/error.response.js'
import userRepo from '#models/repository/user.repo.js'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import authHelper from '#helpers/auth.helper.js'
import tokenService from './token.service.js'
import data from '#utils/data.js'

const SignUp = async ({ email, password }) => {
  const foundUser = userRepo.findUserByEmail({ email })
  if (foundUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exists!')

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = await userRepo.createUser({ email, password: passwordHash })
  if (!newUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'Register user error')


  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
  })

  //tạo accessToken voi refreshToken
  const tokens = await authHelper.createTokenPair({ userId: newUser._id, email }, publicKey, privateKey)
  //lưu token vào db
  await tokenService.createToken({
    userId: newUser._id,
    publicKey,
    privateKey,
    refreshToken: tokens.refreshToken
  })
  return { user: data.getInfo(['_id', 'user_name', 'user_email'], newUser), tokens }
}

export default {
  SignUp
}