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

export const historyQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    type: Joi.string().valid('IN', 'OUT'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().when('startDate', {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref('startDate'))
    }),
    productId: objectId,
    skuId: objectId
  })
}

export const chartQuerySchema = {
  query: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().when('startDate', {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref('startDate'))
    })
  })
}
