/* eslint-disable no-unused-vars */
import ApiError from '#shared/core/error.response.js'
import userRepo from '#modules/auth/repos/user.repo.js'
import shopModel from '#modules/shop/models/shop.model.js'
import { StatusCodes } from 'http-status-codes'
import roleService from '#modules/rbac/services/role.service.js'
import data from '#shared/utils/data.js'
import shopRepo from '#modules/shop/repos/shop.repo.js'
import { updateSubModel } from '#shared/helpers/object.helper.js'
import addressService from '../../address/services/address.service.js'

const registerShop = async ({ name, userId, address, contact }) => {
  const foundUser = await userRepo.findUserById(userId)
  if (!foundUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'User does not exists')

  const newShop = await shopModel.create({ shop_owner: userId, shop_name: name, shop_contact: contact })
  const [roleResult, newAddress] = await Promise.all([
    roleService.changeRoleShop({ userId, shopId: newShop.id }),
    addressService.creatAddress({ ownId: newShop._id, reqBody: { ...address, owner_type: 'shop' } })
  ])
  const shopData = data.getInfoNested(['shop_owner', 'shop_name', 'shop_logo', 'shop_address.full_address', 'shop_contact', 'id'], newShop)
  return {
    ...shopData,
    shop_addresses: [newAddress]
  }
}

const getShopByUser = async ({ userId }) => {
  const foundUser = await userRepo.findUserById(userId)
  if (!foundUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'User does not exists')
  return await shopRepo.findShopByUserId(userId)
}

const updateInfoShop = async ({ userId, shopId, reqBody }) => {
  const foundShop = await shopRepo.findShopByIdAndOwnId({ shopId, userId })
  if (!foundShop) throw new ApiError(StatusCodes.BAD_REQUEST, 'User does not exists')
  return await updateSubModel({
    model: shopModel,
    id: shopId,
    payload: reqBody,
    allowedFields: ['shop_name', 'shop_logo', 'shop_address', 'shop_contact']
  })
}

const deleteShop = async ({ userId, shopId }) => {
  const foundShop = await shopRepo.findShopByIdAndOwnId({ shopId, userId })
  if (!foundShop) throw new ApiError(StatusCodes.BAD_REQUEST, 'User does not exists')
  return await shopRepo.changeStatus(shopId, 'inactive')
}
const getInfoShop = async ({ shopId }) => {
  const foundShop = await shopModel.findById(shopId)
    .select('shop_name shop_logo shop_addresses shop_metrics default_address_id')
    .populate('default_address_id', 'fullAdress')
    .lean()
  if (!foundShop) throw new ApiError(StatusCodes.BAD_REQUEST, 'User does not exists')
  return foundShop
}

export default {
  registerShop,
  getShopByUser,
  updateInfoShop,
  deleteShop,
  getInfoShop
}