
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'

export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = {
  'any.required': 'Email là bắt buộc',
  'string.empty': 'Email không được để trống',
  'string.pattern.base': 'Email không đúng format'
}

export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = {
  'any.required': 'Password là bắt buộc',
  'string.empty': 'Password không được để trống',
  'string.pattern.base': 'Password phải đủ mạnh'
}

export const OTP_TOKEN_RULE = /^\d{6}$/
export const OTP_TOKEN_RULE_MESSAGE = {
  'string.empty': 'OTP không được để trống',
  'any.required': 'OTP là bắt buộc',
  'string.pattern.base': 'OTP phải gồm đúng 6 chữ số'
}
export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
// ObjectId
export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = {
  'any.required': 'This field is required.',
  'string.pattern.base': 'Your string fails to match the Object Id pattern!'
}

// Product fields
export const PRODUCT_NAME_RULE = { min: 3, max: 100 }
export const PRODUCT_NAME_MESSAGE = {
  'string.base': 'Product name must be a string',
  'string.empty': 'Product name is required',
  'string.min': `Product name must be at least ${PRODUCT_NAME_RULE.min} characters`,
  'string.max': `Product name cannot exceed ${PRODUCT_NAME_RULE.max} characters`,
  'any.required': 'Product name is required'
}

export const PRODUCT_PRICE_RULE = { min: 0 }
export const PRODUCT_PRICE_MESSAGE = {
  'number.base': 'Product price must be a number',
  'number.min': `Product price must be at least ${PRODUCT_PRICE_RULE.min}`,
  'any.required': 'Product price is required'
}

export const PRODUCT_QUANTITY_RULE = { min: 1 }
export const PRODUCT_QUANTITY_MESSAGE = {
  'number.base': 'Product quantity must be a number',
  'number.min': `Product quantity must be at least ${PRODUCT_QUANTITY_RULE.min}`,
  'any.required': 'Product quantity is required'
}

export const PRODUCT_TYPE_VALUES = ['Product', 'Electronic', 'Clothing', 'Furniture', 'Cosmetics', 'Food', 'Book']
export const PRODUCT_TYPE_MESSAGE = {
  'any.only': 'Invalid product type',
  'any.required': 'Product type is required'
}

export const IMAGE_URL_RULE = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i
export const IMAGE_URL_RULE_MESSAGE = {
  'any.required': 'Image URL is required',
  'string.empty': 'Image URL cannot be empty',
  'string.pattern.base': 'Image must be a valid image URL (jpg, jpeg, png, webp, gif)'
}

export const PRODUCT_ATTRIBUTES_RULE = { min: 1 }
export const PRODUCT_ATTRIBUTES_MESSAGE = {
  'object.base': 'Attributes must be an object',
  'object.min': 'Attributes cannot be empty',
  'any.required': 'Product attributes are required'
}

export const FILE_UPLOAD_RULE = {
  maxSize: 10 * 1024 * 1024, // 10 MB
  allowedTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
}

export const FILE_UPLOAD_MESSAGE = {
  'file.max': `File size must be less than ${FILE_UPLOAD_RULE.maxSize / 1024 / 1024} MB`,
  'file.type': `File type must be one of: ${FILE_UPLOAD_RULE.allowedTypes.join(', ')}`
}
