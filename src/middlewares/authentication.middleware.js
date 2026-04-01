/* eslint-disable no-unused-vars */
import asyncHandler from '#helpers/asyncHandler.js'
import authHelper from '#helpers/auth.helper'
import tokenService from '#services/token.service.js'
import { HEADER } from '#utils/constant.js'

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Request')

  const keyStore = await tokenService.getTokensByUserId({ userId })
  if (!keyStore) throw new ApiError(StatusCodes.NOT_FOUND, 'Not found keyStore')

  const refreshToken = req.cookies.refreshToken
  if (refreshToken) {
    try {
      const decodeUser = verifyJWT(refreshToken, keyStore.publicKey)
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
})

export default authentication