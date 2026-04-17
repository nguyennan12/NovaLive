import { StatusCodes } from 'http-status-codes'
import ApiError from '#core/error.response.js'
import uploadCloud from '#config/cloudinary.config.js'

const uploadImageFromLocal = async ({ path, folderName }) => {
  try {
    const result = await uploadCloud.uploader.upload(path, {
      folder: folderName
    })
    return {
      image_url: result.secure_url,
      thumb_url: uploadCloud.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg',
        crop: 'fill'
      })
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Upload image error: ${error.message}`)
  }
}

const uploadMultiImageFromLocal = async ({ files, folderName = 'product/8409' }) => {
  try {
    if (!files || !files.length) return []
    const uploadPromises = files.map(file =>
      uploadCloud.uploader.upload(file.path, { folder: folderName })
    )
    const results = await Promise.all(uploadPromises)

    const uploadedUrls = results.map(result => ({
      image_url: result.secure_url,
      thumb_url: uploadCloud.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg',
        crop: 'fill'
      })
    }))

    return uploadedUrls
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Upload multi image error: ${error.message}`)
  }
}

export default {
  uploadImageFromLocal,
  uploadMultiImageFromLocal
}