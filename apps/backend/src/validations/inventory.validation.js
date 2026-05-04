import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '#shared/utils/validator.js'

const objectId = Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE)

export const addStockSchema = {
  body: Joi.object({
    productId: objectId.required(),
    skuId: objectId.required(),
    stock: Joi.number().integer().positive().required(),
    type: Joi.string().valid('IN', 'OUT').required(),
    reason: Joi.string().allow('').default(''),
    note: Joi.string().allow('', null),
    location: Joi.string().allow('').default('')
  })
}


