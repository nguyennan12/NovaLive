import categoryController from '#modules/category/controllers/category.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import express from 'express'
import authentication from '#shared/middlewares/authentication.middleware.js'
import validate from '#shared/middlewares/validate.middleware.js'
import {
  createCategorySchema,
  createCategoryBulkSchema,
  addAttributeSchema,
  addAttributesBulkSchema,
  querySlugSchema
} from '#validations/category.validation.js'
import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()

Router.get('', validate(querySlugSchema), asyncHandler(categoryController.getAllCategory))
Router.get('/attribute', validate(querySlugSchema), asyncHandler(categoryController.getAttributeByCategorySlug))

Router.use(authentication)

Router.post('', grantAccess('create:any', 'CATEGORY'), validate(createCategorySchema), asyncHandler(categoryController.createCategory))
Router.post('/bulk', grantAccess('create:any', 'CATEGORY'), validate(createCategoryBulkSchema), asyncHandler(categoryController.createCategoryBulk))
Router.post('/:categoryId/attribute', grantAccess('update:any', 'CATEGORY'), validate(addAttributeSchema), asyncHandler(categoryController.addAttributeToCategory))
Router.post('/:categoryId/attribute/bulk', grantAccess('update:any', 'CATEGORY'), validate(addAttributesBulkSchema), asyncHandler(categoryController.addAttributesToCategoryBulk))

export const categoryRouter = Router
