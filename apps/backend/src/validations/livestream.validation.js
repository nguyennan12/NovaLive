import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '#shared/utils/validator.js'

const objectId = Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE)

export const createLiveSessionSchema = {
  body: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(1000).allow('', null),
    scheduledAt: Joi.date().greater('now')
      .messages({ 'date.greater': 'Scheduled time must be in the future' })
  })
}

export const updateLiveSessionSchema = {
  params: Joi.object({
    liveId: objectId.required()
  }),
  body: Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().max(1000).allow('', null),
    scheduledAt: Joi.date(),
    live_thumb: Joi.string().allow('', null)
  }).min(1)
}


export const pinProductSchema = {
  params: Joi.object({
    liveId: objectId.required()
  }),
  body: Joi.object({
    productId: objectId.required()
  })
}

const liveSkuSchema = Joi.object({
  sku_id: Joi.string().required(),
  live_price: Joi.number().min(0).required()
})

const liveProductSchema = Joi.object({
  spu_id: Joi.string().required(),
  is_featured: Joi.boolean().default(false),
  skus: Joi.array().items(liveSkuSchema).min(1).required()
})

export const addProductsToLiveSchema = {
  params: Joi.object({
    liveId: objectId.required()
  }),
  body: Joi.array().items(liveProductSchema).min(1)
}

export const liveChartQuerySchema = {
  query: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().when('startDate', {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref('startDate'))
    })
  })
}
