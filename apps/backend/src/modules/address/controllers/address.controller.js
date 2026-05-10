/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import addressService from '#modules/address/services/address.service.js'
import { StatusCodes } from 'http-status-codes'

const creatAddress = async (req, res, next) => {
  const { owner_type } = req.body
  const ownId = owner_type === 'shop' ? req.user.shopId : req.user.userId
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Create address successfully!',
    metadata: await addressService.creatAddress({ reqBody: req.body, ownId })
  }).send(res)
}
const getAllAddresses = async (req, res, next) => {
  const { owner_type } = req.query
  const ownId = owner_type === 'shop' ? req.user.shopId : req.user.userId
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'get address successfully!',
    metadata: await addressService.getAllAddresses({ owner_type, ownId })
  }).send(res)
}
const getAddressDetail = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'geet address successfully!',
    metadata: await addressService.getAddressDetail({ addressId: req.params.addressId, ownId: req.user.userId })
  }).send(res)
}

export default {
  creatAddress,
  getAddressDetail,
  getAllAddresses
}