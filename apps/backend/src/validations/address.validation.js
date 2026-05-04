import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '#shared/utils/validator.js'

const objectId = Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE)

export const createAddressSchema = {
  body: Joi.object({
    owner_type: Joi.string().valid('user', 'shop').required(),
    owner_name: Joi.string().allow(''),
    owner_phone: Joi.string().allow(''),
    street: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    province: Joi.string().required(),
    province_id: Joi.number().integer().required(),
    district_id: Joi.number().integer().required(),
    ward_code: Joi.string().required(),
    fullAddress: Joi.string().allow('', null),
    is_default: Joi.boolean().default(false)
  })
}

export const getAddressesSchema = {
  query: Joi.object({
    owner_type: Joi.string().valid('user', 'shop')
  })
}

export const addressParamSchema = {
  params: Joi.object({
    addressId: objectId.required()
  })
}
