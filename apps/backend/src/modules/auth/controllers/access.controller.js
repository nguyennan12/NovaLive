/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import accessService from '#modules/auth/services/access.service.js'
import { REFRESHTOKEN_LIFE } from '#shared/utils/constant.js'
import emailService from '#modules/common/services/email.service.js'

const signUp = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Sign up successfully!',
    metadata: await accessService.SignUp(req.body)
  }).send(res)
}
const verify = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Verify account successfully!',
    metadata: await accessService.verify(req.body)
  }).send(res)
}
const login = async (req, res, next) => {
  const metadata = await accessService.login(req.body)

  //lưu refresh token vào cookie
  if (metadata.tokens && metadata.tokens.refreshToken) {
    res.cookie('refreshToken', metadata.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESHTOKEN_LIFE
    })
    delete metadata.tokens.refreshToken
  }
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Login successfully!',
    metadata: metadata
  }).send(res)
}

const logout = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Logout successfully!',
    metadata: await accessService.logout({ keyStore: req.keyStore })
  }).send(res)
}

const refreshtoken = async (req, res, next) => {
  const metadata = await accessService.refreshtoken({
    refreshToken: req.refreshToken,
    user: req.user,
    keyStore: req.keyStore
  })

  //lưu refresh token vào cookie
  if (metadata.tokens && metadata.tokens.refreshToken) {
    res.cookie('refreshToken', metadata.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'pro',
      sameSite: 'lax',
      maxAge: REFRESHTOKEN_LIFE
    })
    delete metadata.tokens.refreshToken
  }
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Refresh token successfully!',
    metadata: metadata
  }).send(res)
}

const sendMail = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'send Mail successfully!',
    metadata: await emailService.sendVerificationEmail(req.body)
  }).send(res)
}


const changePassword = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Change password successfully!',
    metadata: await accessService.changePassword({ userId: req.user.userId, ...req.body })
  }).send(res)
}

const logoutAllDevices = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Logged out all devices successfully!',
    metadata: await accessService.logoutAllDevices({ userId: req.user.userId })
  }).send(res)
}

export default {
  signUp,
  verify,
  login,
  logout,
  refreshtoken,
  sendMail,
  changePassword,
  logoutAllDevices
}