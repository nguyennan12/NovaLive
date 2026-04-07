import express from 'express'
import { ProductRouter } from './product.router.js'
import { AccessRouter } from './access.router.js'
import { shopRouter } from './shop.router.js'
import { rbacRouter } from './rbac.router.js'
import { attributeRouter } from './attribute.router.js'
import { categoryRouter } from './category.router.js'
import { discountRouter } from './discount.router.js'

const Router = express.Router()

Router.use('/v1/api/product', ProductRouter)
Router.use('/v1/api/access', AccessRouter)
Router.use('/v1/api/shop', shopRouter)
Router.use('/v1/api/rbac', rbacRouter)
Router.use('/v1/api/attribute', attributeRouter)
Router.use('/v1/api/category', categoryRouter)
Router.use('/v1/api/discount', discountRouter)


export default Router