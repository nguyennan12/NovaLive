/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import spuService from '#services/spu.service.js'
import { StatusCodes } from 'http-status-codes'
import skuService from '#services/sku.service.js'


const createProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.CREATED,
    message: 'Create product successfully!',
    metadata: await spuService.createSpu({ reqBody: req.body, ownId: req.user.userId })
  }).send(res)
}
const getOneSku = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get sku successfully!',
    metadata: await skuService.getOneSku(req.query)
  }).send(res)
}
const getAllSkuBySpuId = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get sku successfully!',
    metadata: await skuService.getAllSkuBySpuId(req.params.spuId)
  }).send(res)
}

export default {
  createProduct,
  getOneSku,
  getAllSkuBySpuId
}