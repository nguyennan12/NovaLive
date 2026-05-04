import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '#shared/utils/validator.js'
export { DiscountValidate } from '#shared/helpers/discount.helper.js'


const discountBase = {
  discount_name: Joi.string(),
  discount_description: Joi.string(),
  discount_start_date: Joi.date().iso(),
  discount_end_date: Joi.date().iso(),
  discount_is_active: Joi.boolean().default(true),
  discount_target: Joi.string().valid('product', 'shipping').default('product'),
  discount_type: Joi.string().valid('percentage', 'fixed_amount').default('fixed_amount'),
  discount_applies_to: Joi.string().valid('all', 'specific').default('all'),
  discount_scope: Joi.string().valid('global', 'shop', 'live').default('global'),
  discount_shopId: Joi.string().pattern(OBJECT_ID_RULE).allow(null).messages(OBJECT_ID_RULE_MESSAGE),
  discount_min_value: Joi.number().min(0),
  discount_value: Joi.number().positive(),
  discount_max_value: Joi.number().min(0),
  discount_max_uses: Joi.number().integer().positive(),
  discount_uses_count: Joi.number().integer().min(0).default(0),
  discount_users_used: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE)),
  discount_max_uses_per_user: Joi.number().integer().positive().default(1),
  discount_product_ids: Joi.array().items(Joi.string()).when('discount_applies_to', {
    is: 'specific',
    then: Joi.array().min(1).required(),
    otherwise: Joi.array().default([])
  })
}

export const createDiscountSchema = {
  body: Joi.object({
    ...discountBase,
    discount_code: Joi.string().uppercase().trim().min(3).max(20).required(),
    discount_name: discountBase.discount_name.required(),
    discount_description: discountBase.discount_description.required(),
    discount_start_date: discountBase.discount_start_date.required(),
    discount_end_date: discountBase.discount_end_date.greater(Joi.ref('discount_start_date')).required()
      .messages({ 'date.greater': 'End date must be after start date' }),
    discount_min_value: discountBase.discount_min_value.required(),
    discount_value: discountBase.discount_value.required(),
    discount_max_value: discountBase.discount_max_value.required(),
    discount_max_uses: discountBase.discount_max_uses.required(),
  })
}

export const updateDiscountSchema = {
  params: Joi.object({
    discountCode: Joi.string().required()
  }),
  body: Joi.object({
    ...discountBase,
    discount_code: Joi.string().uppercase().trim().min(3).max(20),
  }).min(1)
}

export const discountCodeParamSchema = {
  params: Joi.object({
    discountCode: Joi.string().required()
  })
}

export const discountAmountSchema = {
  body: Joi.object({
    discountCode: Joi.string().required(),
    totalOrder: Joi.number().min(0).required()
  })
}

