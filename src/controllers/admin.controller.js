/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import rbacService from '#services/rbac.service.js'
import roleService from '#services/role.service.js'
import categoryService from '#services/category.service.js'
import attributeService from '#services/attribute.service.js'

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
const addGrantstoRole = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Add role successfully!',
    metadata: await rbacService.addGrantstoRole(req.body)
  }).send(res)
}

const getListRole = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Get roles successfully!',
    metadata: await rbacService.getListRole(req.query)
  }).send(res)
}

const changeRole = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Role updated, user will be forced to refresh soon!',
    metadata: await roleService.changeRoleAdmin(req.params)
  }).send(res)
}
const createCategory = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create category successfully!',
    metadata: await categoryService.createCategory(req.body)
  }).send(res)
}
const createCategoryBulk = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create category successfully!',
    metadata: await categoryService.createCategoryBulk(req.body)
  }).send(res)
}
const createAttribute = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create category successfully!',
    metadata: await attributeService.createAttribute(req.body)
  }).send(res)
}
const createAttributeBulk = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create category successfully!',
    metadata: await attributeService.createAttributeBulk(req.body)
  }).send(res)
}
const addAttributeToCategory = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create category successfully!',
    metadata: await categoryService.addAttributeToCategory(req.body)
  }).send(res)
}

export default {
  createResource,
  getListResource,
  createRole,
  getListRole,
  changeRole,
  addGrantstoRole,
  createCategory,
  createAttribute,
  createAttributeBulk,
  createCategoryBulk,
  addAttributeToCategory
}