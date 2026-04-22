import categoryController from '#controllers/category.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('', asyncHandler(categoryController.createCategory))
Router.get('', asyncHandler(categoryController.getAllCategory))
Router.post('/bulk', asyncHandler(categoryController.createCategoryBulk))
Router.post('/:categoryId/attribute', asyncHandler(categoryController.addAttributeToCategory))
Router.post('/:categoryId/attribute/bulk', asyncHandler(categoryController.addAttributesToCategoryBulk))
Router.get('/attribute', asyncHandler(categoryController.getAttributeByCategorySlug))

export const categoryRouter = Router