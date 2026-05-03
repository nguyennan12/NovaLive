/* eslint-disable no-unused-vars */
import asyncHandler from '#shared/helpers/asyncHandler.js'
import authHelper from '#shared/helpers/auth.helper.js'
import tokenService from '#modules/auth/services/token.service.js'
import { HEADER } from '#shared/utils/constant.js'
import ApiError from '#shared/core/error.response.js'
import { redisClient } from '#infrastructure/database/init.redis.js'
import { StatusCodes } from 'http-status-codes'
import { PREFIX } from '#shared/utils/constant.js'

const authentication = asyncHandler(async (req, res, next) => {
  //kiểm tra thông tin người gửi request
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Request')

  //lấy key ra gồm (access, refresh, public, private)
  const keyStore = await tokenService.getkeyStoreByUserId({ userId })
  if (!keyStore) throw new ApiError(StatusCodes.NOT_FOUND, 'Not found keyStore')

  //lấy access và refresh ra xem nào dc sử dụng
  const refreshToken = req.cookies.refreshToken
  const accessToken = authHelper.parseBearerToken(req.headers[HEADER.AUTHORIZATION])
  const tokenToVerify = refreshToken ? refreshToken : accessToken
  if (!tokenToVerify) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Request')
  try {
    const decodeUser = authHelper.verifyJWT(tokenToVerify, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid user id')
    //kiểm tra có bị thay đổi quyền chưa
    const roleCache = await redisClient.get(`${PREFIX.USER_RULE}:${userId}`)
    if (roleCache && roleCache !== decodeUser.role) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Role updated, user will be forced to refresh soon.')
    }
    //lưu lại vào req để tầng sau xử lý
    req.keyStore = keyStore
    req.user = decodeUser
    if (refreshToken && tokenToVerify === refreshToken) {
      req.refreshToken = refreshToken
    }
    return next()
  } catch (error) { throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication Error') }
})

export default authentication