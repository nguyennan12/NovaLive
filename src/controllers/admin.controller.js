/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import rbacService from '#services/rbac.service.js'

const createResource = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create resourece successfully!',
    metadata: await rbacService.createResource(req.body)
  }).send(res)
}
const getListResource = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Get resources successfully!',
    metadata: await rbacService.getListResource(req.params)
  }).send(res)
}
const createRole = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create role successfully!',
    metadata: await rbacService.createRole(req.body)
  }).send(res)
}

const getListRole = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Get roles successfully!',
    metadata: await rbacService.getListRole(req.params)
  }).send(res)
}

export default {
  createResource,
  getListResource,
  createRole,
  getListRole
}