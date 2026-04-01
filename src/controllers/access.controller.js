/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import accessService from '#services/access.service.js'

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

export default {
  signUp,
  verify
}