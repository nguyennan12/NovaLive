/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import spuService from '#services/spu.service.js'
import { StatusCodes } from 'http-status-codes'
import skuService from '#services/sku.service.js'


const createProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create product successfully!',
    metadata: await spuService.createSpu({ reqBody: req.body, userId: req.user.userId, userEmail: req.user.email, })
  }).send(res)
}
const getOneSku = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get sku successfully!',
    metadata: await skuService.getOneSku(req.query)
  }).send(res)
}

const updateSingleSku = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'update sku successfully!',
    metadata: await skuService.updateSingleSku({ spuId: req.params.productId, skuId: req.params.skuId, payload: req.body, userId: req.user.userId })
  }).send(res)
}

const getAllSkuBySpuId = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get sku successfully!',
    metadata: await skuService.getAllSkuBySpuId(req.params.spuId)
  }).send(res)
}

const updateProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Update product successfully!',
    metadata: await spuService.updateProduct({ productId: req.params.productId, reqBody: req.body, userId: req.user.userId })
  }).send(res)
}

const publishProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Published product successfully!',
    metadata: await spuService.publishProduct({ productId: req.params.productId, userId: req.user.userId })
  }).send(res)
}

const unPublishProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Unpublished product successfully!',
    metadata: await spuService.unPublishProduct({ productId: req.params.productId, userId: req.user.userId })
  }).send(res)
}

const getPublishedProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get list published product successfully!',
    metadata: await spuService.getPublishedProduct({ userId: req.user.userId })
  }).send(res)
}

const getDraftProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get list draft product successfully!',
    metadata: await spuService.getDraftProduct({ userId: req.user.userId })
  }).send(res)
}

const getAllProducts = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get list product successfully!',
    metadata: await spuService.getAllProducts(req.query, req?.user?.shopId)
  }).send(res)
}
const querySkusList = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get list sku successfully!',
    metadata: await skuService.querySkusList(req.query, req?.user?.shopId)
  }).send(res)
}

const getProductDetail = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get product successfully!',
    metadata: await spuService.getProductDetail({ productId: req.params.productId })
  }).send(res)
}

const deleteProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get product successfully!',
    metadata: await spuService.deleteProduct({ productId: req.params.productId, userId: req.user.userId })
  }).send(res)
}

const searchProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Search product successfully!',
    metadata: await spuService.searchProduct(req.query)
  }).send(res)
}

export default {
  createProduct,
  getOneSku,
  getAllSkuBySpuId,
  querySkusList,
  updateProduct,
  publishProduct,
  unPublishProduct,
  getPublishedProduct,
  deleteProduct,
  getDraftProduct,
  getAllProducts,
  getProductDetail,
  searchProduct,
  updateSingleSku,
}