import rbacController from '#controllers/rbac.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'

const Router = express.Router()

Router.use(authentication)
Router.post('/resource/', asyncHandler(rbacController.createResource))
Router.get('/resource/', asyncHandler(rbacController.getListResource))
Router.post('/role/', asyncHandler(rbacController.createRole))
Router.get('/role/', asyncHandler(rbacController.getListRole))
Router.patch('/role/:userId', asyncHandler(rbacController.changeRole))
Router.put('/role/grants', asyncHandler(rbacController.addGrantstoRole))


export const rbacRouter = Router