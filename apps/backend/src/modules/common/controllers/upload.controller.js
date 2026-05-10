/* eslint-disable no-unused-vars */
import ApiSuccess from '#shared/core/success.response.js'
import uploadService from '#modules/common/services/upload.service.js'
import userRepo from '#modules/auth/repos/user.repo.js'
import shopModel from '#modules/shop/models/shop.model.js'
import { CLOUDINARY_ROOT_FOLDER } from '#shared/utils/constant.js'
import { StatusCodes } from 'http-status-codes'

const uploadProductImage = async (req, res, next) => {
  const file = req.file
  const shopId = req.user.shopId
  const folderName = `${CLOUDINARY_ROOT_FOLDER}/Shops/${shopId}/Products`
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Upload thumb product successfully!',
    metadata: await uploadService.uploadImageFromLocal({ path: file.path, folderName: folderName })
  }).send(res)
}
const uploadMultiProductImage = async (req, res, next) => {
  const files = req.files
  const shopId = req.user.shopId
  const folderName = `${CLOUDINARY_ROOT_FOLDER}/Shops/${shopId}/Products`
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Upload multi thumb product successfully!',
    metadata: await uploadService.uploadMultiImageFromLocal({ files: files, folderName: folderName })
  }).send(res)
}
const uploadAvatar = async (req, res, next) => {
  const file = req.file
  const userId = req.user.userId
  const folderName = `${CLOUDINARY_ROOT_FOLDER}/Users/${userId}/avatar`
  const result = await uploadService.uploadImageFromLocal({ path: file.path, folderName })
  await userRepo.updateUserById({ userId, data: { user_avatar: result.image_url } })
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Upload avatar successfully!',
    metadata: result
  }).send(res)
}

const uploadShopLogo = async (req, res, next) => {
  const file = req.file
  const shopId = req.user.shopId
  const folderName = `${CLOUDINARY_ROOT_FOLDER}/Shops/${shopId}/logo`
  const result = await uploadService.uploadImageFromLocal({ path: file.path, folderName })
  await shopModel.findByIdAndUpdate(shopId, { shop_logo: result.image_url })
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Upload shop logo successfully!',
    metadata: result
  }).send(res)
}

export default {
  uploadProductImage,
  uploadAvatar,
  uploadMultiProductImage,
  uploadShopLogo
}