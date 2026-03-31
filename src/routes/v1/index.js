import express from 'express'
import { ProductRouter } from './product.router.js'
import { AccessRouter } from './access.router.js'
import converter from '#utils/converter.js'

const Router = express.Router()

const fakeAuth = (req, res, next) => {
  req.user = {
    userId: converter.toObjectId('69be6f4cef1796d702458fa2')
  }
  next()
}
Router.use(fakeAuth)

Router.use('/v1/api/product', ProductRouter)
Router.use('/v1/api/access', AccessRouter)

export default Router