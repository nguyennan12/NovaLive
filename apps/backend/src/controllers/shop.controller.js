/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import { StatusCodes } from 'http-status-codes'
import shopService from '#services/shop.service.js'

const registerShop = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Register shop successfully, please login again!',
    metadata: await shopService.registerShop({ userId: req.user.userId, ...req.body })
  }).send(res)
}
const getShopByUser = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get Shop of user successfully!',
    metadata: await shopService.getShopByUser({ userId: req.user.userId })
  }).send(res)
}
const updateInfoShop = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Update Shop successfully!',
    metadata: await shopService.updateInfoShop({ userId: req.user.userId, shopId: req.params.shopId, reqBody: req.body })
  }).send(res)
}
const deleteShop = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Delete shop successfully!',
    metadata: await shopService.deleteShop({ userId: req.user.userId, shopId: req.params.shopId })
  }).send(res)
}


export default {
  registerShop,
  getShopByUser,
  updateInfoShop,
  deleteShop
}