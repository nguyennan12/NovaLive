import adminController from '#controllers/admin.controller.js'
import asyncHandler from '#helpers/asyncHandler.js'
import express from 'express'
import authentication from '#middlewares/authentication.middleware.js'


const Router = express.Router()

Router.use(authentication)
Router.post('/resource/', asyncHandler(adminController.createResource))
Router.get('/resource/', asyncHandler(adminController.getListResource))
Router.post('/role/', asyncHandler(adminController.createRole))
Router.get('/role/', asyncHandler(adminController.getListRole))
Router.patch('/role/:userId', asyncHandler(adminController.changeRole))
Router.put('/role/add', asyncHandler(adminController.addGrantstoRole))


export const AdminRouter = Router