import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '#shared/utils/validator.js'

const objectId = Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE)

// shop.service.js registerShop nhận { name, address, contact }
const shopAddressSchema = Joi.object({
  street: Joi.string().required(),
  ward: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string().required(),
  province_id: Joi.number().integer().required(),
  district_id: Joi.number().integer().required(),
  ward_code: Joi.string().required(),
  fullAddress: Joi.string().allow('', null)
})

export const registerShopSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    address: shopAddressSchema,
    contact: Joi.string().allow('', null)
  })
}

// updateInfoShop spread reqBody vào model — validate theo model fields
export const updateShopSchema = {
  params: Joi.object({
    shopId: objectId.required()
  }),
  body: Joi.object({
    shop_name: Joi.string().min(2).max(100),
    shop_logo: Joi.string().allow('', null),
    shop_contact: Joi.object({
      phone: Joi.string().allow('', null),
      email: Joi.string().email().allow('', null)
    }),
    shop_settings: Joi.object({
      is_vacation: Joi.boolean(),
      auto_msg: Joi.string().max(500).allow('', null)
    })
  }).min(1)
}

export const shopParamSchema = {
  params: Joi.object({
    shopId: objectId.required()
  })
}
