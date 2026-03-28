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

const publishProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Published product successfully!',
    metadata: await ProductFactory.publishProduct({ productId: req.params.productId, shopId: req.user.userId })
  }).send(res)
}

const unPublishProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Unpublished product successfully!',
    metadata: await ProductFactory.unPublishProduct({ productId: req.params.productId, shopId: req.user.userId })
  }).send(res)
}

const getPublishedProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get list published product successfully!',
    metadata: await ProductFactory.getPublishedProduct({ shopId: req.user.userId })
  }).send(res)
}

const getDraftProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get list draft product successfully!',
    metadata: await ProductFactory.getDraftProduct({ shopId: req.user.userId })
  }).send(res)
}

const getAllProducts = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get list product successfully!',
    metadata: await ProductFactory.getAllProducts(req.query)
  }).send(res)
}

const getProductDetail = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get product successfully!',
    metadata: await ProductFactory.getProductDetail({ productId: req.params.productId })
  }).send(res)
}

const searchProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Search product successfully!',
    metadata: await ProductFactory.searchProduct(req.query)
  }).send(res)
}

export default {
  createProduct,
  updateProduct,
  publishProduct,
  unPublishProduct,
  getPublishedProduct,
  getDraftProduct,
  getAllProducts,
  getProductDetail,
  searchProduct
}