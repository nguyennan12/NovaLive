import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '#shared/utils/validator.js'

const objectId = Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE)

const grantSchema = Joi.object({
  resourceId: objectId.required(),
  actions: Joi.array().items(Joi.string()).min(1).required(),
  attributes: Joi.string().default('*')
})

export const createResourceSchema = {
  body: Joi.object({
    name: Joi.string().uppercase().min(2).max(50).required(),
    description: Joi.string().max(200).allow('', null)
  })
}

export const createRoleSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(200).allow('', null),
    grants: Joi.array().items(grantSchema).default([]),
    parent: Joi.string().allow('', null)
  })
}

export const addGrantsSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    grants: Joi.array().items(grantSchema).min(1).required()
  })
}

export const changeRoleParamSchema = {
  params: Joi.object({
    userId: objectId.required()
  })
}

export const paginationQuerySchema = {
  query: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(30),
    offset: Joi.number().integer().min(0).default(0)
  })
}
