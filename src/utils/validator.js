export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

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
export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']