import Joi from 'joi'

const updateMe = {
  body: Joi.object().keys({
    user_name: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Họ và tên phải ít nhất 2 ký tự',
      'string.max': 'Họ và tên tối đa 100 ký tự'
    }),
    user_phone: Joi.string().pattern(/^(0[3-9]\d{8})?$/).allow('').optional().messages({
      'string.pattern.base': 'Số điện thoại không hợp lệ'
    }),
    user_gender: Joi.string().valid('male', 'female', 'other').optional().messages({
      'any.only': 'Giới tính không hợp lệ'
    }),
    user_birthday: Joi.string().isoDate().allow('', null).optional().messages({
      'string.isoDate': 'Ngày sinh không hợp lệ'
    }),
    user_avatar: Joi.string().uri().optional()
  })
}

export default { updateMe }
