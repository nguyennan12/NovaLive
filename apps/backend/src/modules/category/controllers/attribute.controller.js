/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import attributeService from '#modules/category/services/attribute.service.js'
import { StatusCodes } from 'http-status-codes'

const createAttribute = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create attribute successfully!',
    metadata: await attributeService.createAttribute(req.body)
  }).send(res)
}
const createAttributeBulk = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create attribute successfully!',
    metadata: await attributeService.createAttributeBulk(req.body)
  }).send(res)
}

export default {
  createAttribute,
  createAttributeBulk,
}