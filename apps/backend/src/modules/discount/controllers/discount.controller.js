/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import discountService from '#modules/discount/services/discount.service.js'

const craeteDiscount = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create discount successfully!',
    metadata: await discountService.craeteDiscount(req.body)
  }).send(res)
}
const getAllDiscount = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get all discount successfully!',
    metadata: await discountService.getAllDiscount(req.query)
  }).send(res)
}
const queryDiscounts = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Query discount successfully!',
    metadata: await discountService.queryDiscounts(req.query)
  }).send(res)
}
const getAllDiscountOfShop = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get discount of shop successfully!',
    metadata: await discountService.getAllDiscountOfShop({ shopId: req.params.shopId, ...req.query })
  }).send(res)
}
const getProductsByDiscount = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get product allowed use discount successfully!',
    metadata: await discountService.getProductsByDiscount(req.params.discountCode)
  }).send(res)
}
const updateDiscount = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Update discount successfully!',
    metadata: await discountService.updateDiscount({ discountCode: req.params.discountCode, reqBody: req.body })
  }).send(res)
}
const deleteDiscount = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Delete discount successfully!',
    metadata: await discountService.deleteDiscount(req.params.discountCode)
  }).send(res)
}

const cancelDiscountCode = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Cancel discount successfully!',
    metadata: await discountService.cancelDiscountCode({ discountCode: req.params.discountCode, userId: req.user.userId })
  }).send(res)
}
const checkDiscountAvailable = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Apply discount successfully!',
    metadata: await discountService.checkDiscountAvailable({ discountCode: req.params.discountCode, userId: req.user.userId, totalOrder: req.body.totalOrder })
  }).send(res)
}

const getDiscountAmout = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get discount amount successfully!',
    metadata: await discountService.getDiscountAmout({ userId: req.user.userId, reqBody: req.body })
  }).send(res)
}


export default {
  craeteDiscount,
  getAllDiscount,
  queryDiscounts,
  getAllDiscountOfShop,
  getProductsByDiscount,
  updateDiscount,
  deleteDiscount,
  cancelDiscountCode,
  getDiscountAmout,
  checkDiscountAvailable
}
