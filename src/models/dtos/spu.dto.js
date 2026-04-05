import Joi from 'joi'
import {
  OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE,
  IMAGE_URL_RULE, IMAGE_URL_RULE_MESSAGE,
  PRODUCT_NAME_RULE, PRODUCT_NAME_MESSAGE
} from '#utils/validator.js'

const spuBase = {
  spu_name: Joi.string().min(PRODUCT_NAME_RULE.min).max(PRODUCT_NAME_RULE.max).messages(PRODUCT_NAME_MESSAGE),
  spu_thumb: Joi.string().pattern(IMAGE_URL_RULE).messages(IMAGE_URL_RULE_MESSAGE),
  spu_description: Joi.string().allow('', null),
  spu_price: Joi.number().positive(),
  spu_quantity: Joi.number().integer().min(0),
  spu_category: Joi.array().items(Joi.string()),
  spu_shopId: Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE),
  spu_attributes: Joi.array().items(Joi.object()),
  spu_variations: Joi.array().items(Joi.object()),
}

export const createSpuSchema = {
  body: Joi.object({
    ...spuBase,
    spu_name: spuBase.spu_name.required(),
    spu_thumb: spuBase.spu_thumb.required(),
    spu_price: spuBase.spu_price.required(),
    spu_quantity: spuBase.spu_quantity.required(),
    spu_shopId: spuBase.spu_shopId.required(),
    spu_attributes: spuBase.spu_attributes.required(),
    sku_list: Joi.array().items(Joi.object())
  })
}

export const updateSpuSchema = {
  params: Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).required()
  }),
  body: Joi.object({
    ...spuBase
  }).min(1)
}

export const querySpuSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid('ctime', 'price-asc', 'price-desc').default('ctime'),
    search: Joi.string().allow('')
  })
}