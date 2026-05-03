import Joi from 'joi'
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} from '#shared/utils/validator.js'


const discountBase = {
  discount_name: Joi.string().required(),
  discount_description: Joi.string().required(),
  discount_start_date: Joi.date().iso().required(),
  discount_end_date: Joi.date().iso().greater(Joi.ref('discount_start_date')).required(),

  discount_is_active: Joi.boolean().default(true),
  discount_target: Joi.string().valid('product', 'shipping').default('product'),
  discount_type: Joi.string().valid('percentage', 'fixed_amount').default('fixed_amount'),
  discount_applies_to: Joi.string().valid('all', 'specific').default('all'),
  discount_scope: Joi.string().valid('global', 'shop', 'live').default('global'),
  discount_shopId: Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE).allow(null),

  // Value rules
  discount_min_value: Joi.number().min(0).required(),
  discount_value: Joi.number().positive().required(),
  discount_max_value: Joi.number().min(0).required(),

  // Usage rules
  discount_max_uses: Joi.number().integer().positive().required(),
  discount_uses_count: Joi.number().integer().min(0).default(0),
  discount_users_used: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE)),
  discount_max_uses_per_user: Joi.number().integer().positive().default(1),
  discount_product_ids: Joi.array().items(Joi.string()).when('discount_apply_to', {
    is: 'specific',
    then: Joi.array().min(1).required(),
    otherwise: Joi.array().default([])
  })
}

export const createDiscountSchema = {
  body: Joi.object(discountBase)
}

export const updateDiscountSchema = {
  params: Joi.object({
    discountCode: Joi.string().required()
  }),
  body: Joi.object({
    ...discountBase,
    discount_name: Joi.string(),
    discount_description: Joi.string(),
    discount_code: Joi.string(),
    discount_start_date: Joi.date(),
    discount_end_date: Joi.date().greater(Joi.ref('discount_start_date')),
    discount_min_value: Joi.number().min(0),
    discount_value: Joi.number().positive(),
    discount_max_value: Joi.number().min(0),
    discount_max_uses: Joi.number().integer().positive(),
  }).min(1)
}
