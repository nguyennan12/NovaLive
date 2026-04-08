import ApiError from '#core/error.response.js'
import { redisClient } from '#database/init.redis.js'
import inventoryModel from '#models/inventory.model.js'
import spuRepo from '#models/repository/spu.repo.js'
import { skuModel } from '#models/sku.model.js'
import converter from '#utils/converter.js'
import { StatusCodes } from 'http-status-codes'
import { PREFIX } from '#utils/constant.js'
import fileHelper from '#helpers/file.helper.js'
import { RabbitMQClient } from '#database/init.rabbitMQ.js'

const reserveStockScript = fileHelper.loadLuaScript('lua/reserveStock.lua')

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
  const prefix = `${PREFIX.INVENTORY_SKU}:${skuId}:stock`
  const ivenExistsCache = await redisClient.exists(prefix)

  const isHot = foundProduct.live?.is_live || newInven.inven_stock < 10
  if (isHot || ivenExistsCache) {
    const ttl = 60 * 60
    await redisClient.set(prefix, newInven.inven_stock - newInven.inven_reserved, 'EX', ttl)
  }
  return newInven
}

const checkAvailableStock = async ({ skuId, quantity }) => {
  const prefix = `${PREFIX.INVENTORY_SKU}:${skuId}:stock`
  const stockCache = await redisClient.get(prefix)
  if (stockCache >= quantity) return true

  const foundStock = await inventoryModel.findOne({ inven_skuId: skuId })
  if (!foundStock) return false
  const availableStock = foundStock.inven_stock - foundStock.inven_reserved

  if (availableStock) {
    const ttl = 60 * 60
    await redisClient.set(prefix, availableStock, 'EX', ttl)
  }
  return availableStock >= quantity
}

const reserveStock = async ({ userId, orderId, items }) => {
  if (!items || items.lenght === 0) throw new ApiError(StatusCodes.BAD_REQUEST, 'Cart is blank!')
  const keys = [], args = []

  items.forEach(item => {
    keys.push(`${PREFIX.INVENTORY_SKU}:${item.skuId}:stock`)
    args.push(items.quantity.toString())
  })

  const result = await redisClient.eval(reserveStockScript, keys.length, ...keys, ...args)
  if (result === 0) throw new ApiError(StatusCodes.BAD_REQUEST, 'Have a product is sold out! please check again')

  const payload = { action: 'RESERVE_DB', orderId, userId, items }
  await RabbitMQClient.publishMessage('inventory_queue', payload)
  return { status: 'SUCCESS', message: 'Order Successfully' }
}

const releaseStock = async (orderId, items) => {
  if (!items || items.length === 0) throw new ApiError(StatusCodes.BAD_REQUEST, 'Cart is blank!')
  const bulkOperations = items.map(item => {
    return {
      updateOne: {
        filter: {
          inven_skuId: item.skuId,
          'inven_reservations.orderId': orderId
        },
        update: {
          $inc: { inven_reserved: -item.quantity },
          $pull: { inven_reservations: { orderId: orderId } }
        }
      }
    }
  })
  const result = await inventoryModel.bulkWrite(bulkOperations)

  await Promise.all(items.map(async (item) => {
    const prefix = `${PREFIX.INVENTORY_SKU}:${skuId}:stock`
    const exists = await redisClient.exists(prefix)
    if (exists) await redisClient.incrBy(prefix, item.quantity)
  }))
  return {
    status: 'SUCCESS',
    message: 'Release stock successfully',
    details: result
  }
}

const confirmDeductStock = async (orderId, items) => {
  const bulkOperations = items.map(item => {
    return {
      updateOne: {
        filter: {
          inven_skuId: item.skuId,
          'inven_reservations.orderId': orderId
        },
        update: {
          $inc: {
            inven_stock: -item.quantity,
            inven_reserved: -item.quantity
          },
          $pull: { inven_reservations: { orderId: orderId } }
        }
      }
    }
  })
  const result = await inventoryModel.bulkWrite(bulkOperations)
  //có thể gửi message cho các service khác
  return {
    status: 'SUCCESS',
    message: 'Deduct stock successfully',
    details: result
  }
}
export default {
  addStockToInventory,
  checkAvailableStock,
  reserveStock,
  releaseStock,
  confirmDeductStock
}