import Joi from 'joi'


const catIdParam = Joi.string().required()

export const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    parentId: Joi.string().allow(null, '')
  })
}

export const createCategoryBulkSchema = {
  body: Joi.array().items(
    Joi.object({
      name: Joi.string().min(1).max(100).required(),
      parentId: Joi.string().allow(null, '')
    })
  ).min(1)
}

export const categoryParamSchema = {
  params: Joi.object({
    categoryId: catIdParam
  })
}


export const addAttributeSchema = {
  params: Joi.object({
    categoryId: catIdParam
  }),
  body: Joi.object({
    attributeId: Joi.string().required(),
    isRequired: Joi.boolean().default(false),
    displayOrder: Joi.number().integer().min(0).default(0)
  })
}

export const addAttributesBulkSchema = {
  params: Joi.object({
    categoryId: catIdParam
  }),
  body: Joi.array().items(
    Joi.object({
      attributeId: Joi.string().required(),
      isRequired: Joi.boolean().default(false),
      displayOrder: Joi.number().integer().min(0).default(0)
    })
  ).min(1)
}

export const querySlugSchema = {
  query: Joi.object({
    slug: Joi.string().allow('', null)
  })
}
