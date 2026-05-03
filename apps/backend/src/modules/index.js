import express from 'express'
import { ProductRouter } from './product/routes/product.router.js'
import { AccessRouter } from './auth/routes/access.router.js'
import { shopRouter } from './shop/routes/shop.router.js'
import { rbacRouter } from './rbac/routes/rbac.router.js'
import { attributeRouter } from './category/routes/attribute.router.js'
import { categoryRouter } from './category/routes/category.router.js'
import { discountRouter } from './discount/routes/discount.router.js'
import { inventoryRouter } from './inventory/routes/inventory.route.js'
import { cartRouter } from './cart/routes/cart.router.js'
import { orderRouter } from './order/routes/order.router.js'
import { paymentRouter } from './payment/routes/payment.router.js'
import { livestreamRouter } from './live/routes/livestream.router.js'
import { uploadRouter } from './common/routers/upload.router.js'
import { addressRouter } from './address/routes/address.router.js'

const Router = express.Router()

Router.use('/v1/api/product', ProductRouter)
Router.use('/v1/api/access', AccessRouter)
Router.use('/v1/api/shop', shopRouter)
Router.use('/v1/api/rbac', rbacRouter)
Router.use('/v1/api/attribute', attributeRouter)
Router.use('/v1/api/category', categoryRouter)
Router.use('/v1/api/discount', discountRouter)
Router.use('/v1/api/inventory', inventoryRouter)
Router.use('/v1/api/cart', cartRouter)
Router.use('/v1/api/order', orderRouter)
Router.use('/v1/api/payment', paymentRouter)
Router.use('/v1/api/livestream', livestreamRouter)
Router.use('/v1/api/upload', uploadRouter)
Router.use('/v1/api/address', addressRouter)


export default Router