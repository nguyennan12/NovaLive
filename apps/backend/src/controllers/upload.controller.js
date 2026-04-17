/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import uploadService from '#services/upload.service.js'
import { CLOUDINARY_ROOT_FOLDER } from '#utils/constant.js'
import { StatusCodes } from 'http-status-codes'

const uploadProductImage = async (req, res, next) => {
  const file = req.file
  const shopId = req.user.shopId
  folderName = `${CLOUDINARY_ROOT_FOLDER}/Shops/${shopId}/Products`
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Upload thumb product successfully!',
    metadata: await uploadService.uploadImageFromLocal({ path: file.path, folderName: folderName })
  }).send(res)
}
const uploadMultiProductImage = async (req, res, next) => {
  const files = req.files
  const shopId = req.user.shopId
  folderName = `${CLOUDINARY_ROOT_FOLDER}/Shops/${shopId}/Products`
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Upload multi thumb product successfully!',
    metadata: await uploadService.uploadMultiImageFromLocal({ files: files, folderName: folderName })
  }).send(res)
}
const uploadAvatar = async (req, res, next) => {
  const file = req.file
  const userId = req.user.userId
  folderName = `${CLOUDINARY_ROOT_FOLDER}/Users/${userId}/avatar`
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Upload avatar successfully!',
    metadata: await uploadService.uploadMultiImageFromLocal({ path: file.path, folderName: folderName })
  }).send(res)
}

export default {
  uploadProductImage,
  uploadAvatar,
  uploadMultiProductImage
}