import ApiError from '#core/error.response.js'
import { redisClient } from '#database/init.redis.js'
import inventoryModel from '#models/inventory.model.js'
import spuRepo from '#models/repository/spu.repo.js'
import { skuModel } from '#models/sku.model.js'
import converter from '#utils/converter.js'
import { StatusCodes } from 'http-status-codes'
import { PREFIX } from '#utils/constant.js'


const addStockToInventory = async ({ shopId, reqBody }) => {
  const { productId, skuId, stock } = reqBody
  if (!stock || stock < 0) throw new ApiError(StatusCodes.BAD_REQUEST, 'Stock invalid')
  const [foundSku, foundProduct] = await Promise.all([
    skuModel.findOne({ sku_spuId: productId, sku_id: skuId }).lean(),
    spuRepo.findProductDetail(productId)
  ])
  if (!foundSku || !foundProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product does not exists')
  }
  const newInven = await inventoryModel.findOneAndUpdate(
    {
      inven_shopId: converter.toObjectId(shopId),
      inven_productId: productId,
      inven_skuId: skuId
    },
    {
      $inc: { inven_stock: stock }
    },
    { upsert: true, new: true }
  )
  const prefix = `${PREFIX.INVENTORY_STOCK_SKU}:${skuId}`
  const ivenExistsCache = await redisClient.exists(prefix)

  const isHot = foundProduct.live?.is_live || newInven.inven_stock < 10
  if (isHot || ivenExistsCache) {
    const ttl = 60 * 60
    await redisClient.set(prefix, newInven.inven_stock, 'EX', ttl)
  }
  return newInven
}

const checkAvailableStock = async ({ skuId, quantity }) => {
  const isCache = await redisClient.get()
}
export default {
  addStockToInventory
}