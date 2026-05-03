import { CLOUDINARY_ROOT_FOLDER } from '#shared/utils/constant.js'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINAY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: CLOUDINARY_ROOT_FOLDER,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],

  }
})

const uploadCloud = multer({ storage })

export default uploadCloud