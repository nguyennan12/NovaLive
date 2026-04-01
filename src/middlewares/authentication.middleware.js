/* eslint-disable no-unused-vars */
import asyncHandler from '#helpers/asyncHandler.js'
import authHelper from '#helpers/auth.helper.js'
import tokenService from '#services/token.service.js'
import { HEADER } from '#utils/constant.js'
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'

const authentication = asyncHandler(async (req, res, next) => {
  //kiểm tra thông tin người gửi request
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Request')

  //lấy key ra gồm (access, refresh, public, private)
  const keyStore = await tokenService.getkeyStoreByUserId({ userId })
  if (!keyStore) throw new ApiError(StatusCodes.NOT_FOUND, 'Not found keyStore')

  const refreshToken = req.cookies.refreshToken
  if (refreshToken) {
    try {
      const decodeUser = authHelper.verifyJWT(refreshToken, keyStore.publicKey)
      if (userId !== decodeUser.userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid user id')
      //lưu vào req để tầng sau xử lý
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (error) { throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh Token expired or invalid') }
  }
  const accessToken = authHelper.parseBearerToken(req.headers[HEADER.AUTHORIZATION])
  if (!accessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Request')

  //tương tự bước trên lưu thông tin lại vào req và gửi đến tầng tiếp theo
  const decodeUser = verifyJWT(refreshToken, keyStore.publicKey)
  if (userId !== decodeUser.userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid user id')
  req.keyStore = keyStore
  req.user = decodeUser
  return next()
})

export default authentication