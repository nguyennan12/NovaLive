/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import categoryService from '#modules/category/services/category.service.js'

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
const addAttributesToCategoryBulk = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create category successfully!',
    metadata: await categoryService.addAttributesToCategoryBulk({ categoryId: req.params.categoryId, reqBody: req.body })
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
  getAllCategory,
  addAttributesToCategoryBulk
}