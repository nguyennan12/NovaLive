import categoryController from '#controllers/category.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

import grantAccess from '#middlewares/rbac.middleware.js'

const Router = express.Router()

Router.get('', asyncHandler(categoryController.getAllCategory))
Router.get('/attribute', asyncHandler(categoryController.getAttributeByCategorySlug))

Router.use(authentication)

Router.post('', grantAccess('create:any', 'CATEGORY'), asyncHandler(categoryController.createCategory))
Router.post('/bulk', grantAccess('create:any', 'CATEGORY'), asyncHandler(categoryController.createCategoryBulk))
Router.post('/:categoryId/attribute', grantAccess('update:any', 'CATEGORY'), asyncHandler(categoryController.addAttributeToCategory))
Router.post('/:categoryId/attribute/bulk', grantAccess('update:any', 'CATEGORY'), asyncHandler(categoryController.addAttributesToCategoryBulk))

export const categoryRouter = Router