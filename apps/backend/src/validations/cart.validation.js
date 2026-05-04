import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '#shared/utils/validator.js'

const objectId = Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE)

export const addToCartSchema = {
  body: Joi.object({
    skuId: objectId.required(),
    productId: objectId,            // optional — service stores but không bắt buộc
    shopId: objectId.required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0),
    name: Joi.string(),
    thumb: Joi.string(),
    liveId: objectId.allow(null),
    is_gift: Joi.boolean().default(false)
  })
}

export const updateCartItemSchema = {
  body: Joi.object({
    skuId: objectId.required(),
    quantity: Joi.number().integer().min(0).required(),
    old_quantity: Joi.number().integer().min(1).required()
  })
}

export const removeFromCartSchema = {
  body: Joi.object({
    skuIds: Joi.array().items(objectId).min(1).required()
  })
}
