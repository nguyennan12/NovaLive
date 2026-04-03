import express from 'express'
import { ProductRouter } from './product.router.js'
import { AccessRouter } from './access.router.js'
import { AdminRouter } from './admin.router.js'
import { shopRouter } from './shop.router.js'

const Router = express.Router()

Router.use('/v1/api/product', ProductRouter)
Router.use('/v1/api/access', AccessRouter)
Router.use('/v1/api/admin', AdminRouter)
Router.use('/v1/api/shop', shopRouter)


export default Router