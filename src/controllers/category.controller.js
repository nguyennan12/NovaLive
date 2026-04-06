/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import rbacService from '#services/rbac.service.js'
import roleService from '#services/role.service.js'
import categoryService from '#services/category.service.js'
import attributeService from '#services/attribute.service.js'

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
const addAttributeToCategory = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create category successfully!',
    metadata: await categoryService.addAttributeToCategory({ categoryId: req.params.categoryId, reqBody: req.body })
  }).send(res)
}

const getAttributeByCategorySlug = async (req, res, next) => {
  const { slug } = req.query

  const slugArr = slug?.split(',') || []
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'get attribute successfully!',
    metadata: await categoryService.getAttributeByCategorySlug(slugArr)
  }).send(res)
}

const getAllCategory = async (req, res, next) => {
  const { slug } = req.query

  const slugArr = slug?.split(',') || []
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'get categories successfully!',
    metadata: await categoryService.getAllCategory(slugArr)
  }).send(res)
}

export default {
  createCategory,
  createCategoryBulk,
  addAttributeToCategory,
  getAttributeByCategorySlug,
  getAllCategory
}