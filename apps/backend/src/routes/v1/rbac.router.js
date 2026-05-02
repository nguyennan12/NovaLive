import rbacController from '#controllers/rbac.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'
import grantAccess from '#middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)

Router.post('/resource/', grantAccess('create:any', 'RBAC'), asyncHandler(rbacController.createResource))
Router.get('/resource/', grantAccess('read:any', 'RBAC'), asyncHandler(rbacController.getListResource))
Router.post('/role/', grantAccess('create:any', 'RBAC'), asyncHandler(rbacController.createRole))
Router.get('/role/', grantAccess('read:any', 'RBAC'), asyncHandler(rbacController.getListRole))
Router.patch('/role/:userId', grantAccess('update:any', 'RBAC'), asyncHandler(rbacController.changeRole))
Router.put('/role/grants', grantAccess('update:any', 'RBAC'), asyncHandler(rbacController.addGrantstoRole))

export const rbacRouter = Router