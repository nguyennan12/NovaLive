import ApiError from '#core/error.response.js'
import userRepo from '#models/repository/user.repo.js'
import shopModel from '#models/shop.model.js'
import { StatusCodes } from 'http-status-codes'
import roleService from './role.service.js'
import data from '#utils/data.js'
import shopRepo from '#models/repository/shop.repo.js'
import { updateSubModel } from '#helpers/object.helper.js'

const registerShop = async ({ name, userId, address, contact }) => {
  const foundUser = await userRepo.findUserById(userId)
  if (!foundUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'User does not exists')
  const newShop = await shopModel.create(
    {
      shop_owner: userId, shop_name: name,
      shop_address: {
        ...address,
        full_address: `${address.street}, ${address.ward_name}, ${address.district_name}, ${address.province_name}`
      }, shop_contact: contact
    }
  )
  await roleService.changeRoleShop({ userId, shopId: newShop.id })

  return data.getInfoNested(['shop_owner', 'shop_name', 'shop_logo', 'shop_address.full_address', 'shop_contact', 'id'], newShop)
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

export default {
  registerShop,
  getShopByUser,
  updateInfoShop,
  deleteShop
}