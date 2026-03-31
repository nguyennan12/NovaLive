// import ApiError from '#core/error.response.js'
// import asyncHandler from '#helpers/asyncHandler.js'
// import KeyTokenService from '#services/keyToken.service.js'
// import { StatusCodes } from 'http-status-codes'
// import { HEADER } from '#utils/constant.js'
import JWT from 'jsonwebtoken'


const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30 days'
    })

    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30 days'
    })
    return { accessToken, refreshToken }
  } catch (error) {
    throw error
  }
}


export default {
  createTokenPair
}