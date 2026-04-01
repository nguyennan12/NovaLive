/* eslint-disable no-unused-vars */
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'
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

const verifyJWT = (token, keySecret) => {
  try {
    return JWT.verify(token, keySecret, { algorithms: ['RS256'] })
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token signature')
  }
}

const parseBearerToken = (tokenValue) => {
  if (!tokenValue || typeof tokenValue !== 'string') return null
  const token = tokenValue.trim()
  if (!token) return null
  return token.startsWith('Bearer ') ? token.slice(7).trim() : token
}


export default {
  createTokenPair,
  verifyJWT,
  parseBearerToken
}