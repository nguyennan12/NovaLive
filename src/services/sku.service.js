/* eslint-disable no-unused-vars */
import ApiError from '#core/error.response.js'
import { redisClient } from '#database/init.redis.js'
import productRepo from '#models/repository/product.repo.js'
import spuRepo from '#models/repository/spu.repo.js'
import { skuModel } from '#models/sku.model.js'
import { generateSkuId } from '#utils/data.js'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'


const createSku = async ({ spu_id, sku_list }) => {
  try {
    const skuList = sku_list.map(sku => {
      return { ...sku, sku_spuId: spu_id, sku_id: generateSkuId(spu_id, sku.sku_tier_idx) }
    })
    const newSku = await skuModel.create(skuList)
    return newSku
  } catch (error) {
    return []
  }
}

const getOneSku = async ({ skuId, spuId }) => {
  const cacheKey = `sku:${spuId}:${skuId}`
  const cacheData = await redisClient.get(cacheKey)
  if (cacheData) return JSON.parse(cacheData)

  const sku = await skuModel.findOne({ sku_id: skuId, sku_spuId: spuId, isDeleted: false }).lean()
  if (sku) await redisClient.setEx(cacheKey, 3600, JSON.stringify(sku))
  return _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted'])
}

const getAllSkuBySpuId = async (spuId) => {
  const foundProduct = await spuRepo.findBySpuId(spuId)
  if (!foundProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'Product does not exists!')
  return await skuModel.find({ sku_spuId: foundProduct.spu_id }).lean()
}

export default {
  createSku,
  getOneSku,
  getAllSkuBySpuId
}