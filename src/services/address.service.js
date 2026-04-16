import { addressModel } from '#models/address.model.js'
import converter from '#utils/converter.js'
import { UserModel } from '#models/user.model.js'
import shopModel from '#models/shop.model.js'

const creatAddress = async ({ ownId, reqBody }) => {
  const { owner_type, street, ward, province, district, is_default } = reqBody
  if (is_default) {
    await addressModel.updateMany(
      { owner_id: ownId, onModel: owner_type },
      { $set: { is_default: false } }
    )
  }
  const fullAddress = converter.toFullAdress({ street, ward, district, province })
  const newAddress = await addressModel.create({
    owner_id: ownId,
    fullAdress: fullAddress,
    is_default: is_default || false,
    ...reqBody
  })
  if (owner_type === 'user') {
    await UserModel.findByIdAndUpdate(ownId, {
      $push: { user_addresses: newAddress._id },
      ...(is_default && {
        $set: { default_address_id: newAddress._id }
      })
    })
  } else if (owner_type === 'shop') {
    await shopModel.findByIdAndUpdate(ownId, {
      $push: { shop_addresses: newAddress._id },
      ...(is_default && {
        $set: { default_address_id: newAddress._id }
      })
    })
  }
  return newAddress
}

const getAllAddresses = async ({ ownId, owner_type }) => {
  return await addressModel.find({ owner_id: ownId, owner_type: owner_type, })
    .sort({ is_default: -1, createdAt: -1 })
    .lean()
}

const getAddressDetail = async ({ addressId, ownId }) => {
  const address = await addressModel.findOne({ _id: addressId, owner_id: ownId, }).lean()
  if (!address) throw new ApiError(StatusCodes.NOT_FOUND, 'Address does not exists')
  return address
}

export default {
  creatAddress,
  getAddressDetail,
  getAllAddresses
}