/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import userService from '#modules/auth/services/user.service.js'

const getMe = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get profile successfully!',
    metadata: await userService.getMe({ userId: req.user.userId })
  }).send(res)
}

const updateMe = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Update profile successfully!',
    metadata: await userService.updateMe({ userId: req.user.userId, data: req.body })
  }).send(res)
}

export default { getMe, updateMe }
