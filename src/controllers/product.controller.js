/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import ProductFactory from '#services/product.service.js'
import { StatusCodes } from 'http-status-codes'

const createProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create product successfully!',
    metadata: await ProductFactory.createProduct(
      req.body.product_type,
      { ...req.body, product_shopId: req.user.userId }
    )
  }).send(res)
}

const updateProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Update product successfully!',
    metadata: await ProductFactory.updateProduct(req.params.productId, req.body)
  }).send(res)
}

export default {
  createProduct,
  updateProduct
}