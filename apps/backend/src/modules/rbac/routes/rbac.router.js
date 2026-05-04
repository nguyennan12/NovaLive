import rbacController from '#modules/rbac/controllers/rbac.controller.js'
import asyncHandler from '#shared/helpers/asyncHandler.js'
import express from 'express'
import authentication from '#shared/middlewares/authentication.middleware.js'
import validate from '#shared/middlewares/validate.middleware.js'
import {
  createResourceSchema,
  createRoleSchema,
  addGrantsSchema,
  changeRoleParamSchema,
  paginationQuerySchema
} from '#validations/rbac.validation.js'
import grantAccess from '#shared/middlewares/rbac.middleware.js'

const Router = express.Router()

Router.use(authentication)

Router.post('/resource/', grantAccess('create:any', 'RBAC'), validate(createResourceSchema), asyncHandler(rbacController.createResource))
Router.get('/resource/', grantAccess('read:any', 'RBAC'), validate(paginationQuerySchema), asyncHandler(rbacController.getListResource))
Router.post('/role/', grantAccess('create:any', 'RBAC'), validate(createRoleSchema), asyncHandler(rbacController.createRole))
Router.get('/role/', grantAccess('read:any', 'RBAC'), validate(paginationQuerySchema), asyncHandler(rbacController.getListRole))
Router.patch('/role/:userId', grantAccess('update:any', 'RBAC'), validate(changeRoleParamSchema), asyncHandler(rbacController.changeRole))
Router.put('/role/grants', grantAccess('update:any', 'RBAC'), validate(addGrantsSchema), asyncHandler(rbacController.addGrantstoRole))

export const rbacRouter = Router
