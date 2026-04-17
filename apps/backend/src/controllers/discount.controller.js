/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import discountService from '#services/discount.service.js'

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
const getAllDiscountOfShop = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get discount of shop successfully!',
    metadata: await discountService.getAllDiscountOfShop(req.params.shopId)
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
    metadata: await discountService.updateDiscount({ discountCodeL: req.params.discountCode, reqBody: req.body })
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
    metadata: await discountService.cancelDiscountCode({ discountService: req.params.discountCode, userId: req.user.userId })
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
  getAllDiscountOfShop,
  getProductsByDiscount,
  updateDiscount,
  deleteDiscount,
  cancelDiscountCode,
  getDiscountAmout
}

/*
getDiscountAmout
getAllDiscount
getAllDiscountOfShop
getProductsByDiscount
createDiscount
applyDiscount
updatediscount
deletediscount
*/