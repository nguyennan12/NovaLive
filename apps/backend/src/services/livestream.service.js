import ApiError from '#core/error.response.js'
import { redisClient } from '#database/init.redis.js'
import livestreamModel from '#models/livestream.model.js'
import { PREFIX } from '#utils/constant.js'
import converter from '#utils/converter.js'
import { generateLiveId } from '#utils/generator.js'
import { StatusCodes } from 'http-status-codes'
import skuService from './sku.service.js'
import socketService from './socket.service.js'
import agoraHelper from '#helpers/agora.helper.js'
import livestreamRepo from '#models/repository/livestream.repo.js'

const createLiveSession = async ({ userId, reqBody, shopId }) => {
  const { title, description, scheduleAt } = reqBody

  const newLive = await livestreamModel.create({
    live_title: title,
    live_description: description,
    live_schedule_at: scheduleAt,
    live_streamerId: userId,
    live_code: generateLiveId(),
    live_shopId: shopId
  })
  return newLive
}

const startLive = async ({ userId, liveId }) => {
  const foundLive = await livestreamRepo.findLiveByIdAndType(liveId, 'scheduled')
  if (!foundLive || foundLive.live_streamerId.toString() !== userId.toString()) throw new ApiError(StatusCodes.BAD_REQUEST, 'live session invalid')
  await Promise.all([
    livestreamModel.findOneAndUpdate({ _id: liveId }, { live_status: 'active', live_actual_start: Date.now() }, { returnDocument: 'after' }),
    redisClient.set(`${PREFIX.LIVE_VIEWERS}:${foundLive.live_code}`, 0)
  ])
  const token = agoraHelper.generateToken({
    channelName: liveId.toString(),
    account: userId.toString(),
    roleType: 'HOST'
  })
  return { ...foundLive, token }
}

const joinLive = async ({ liveId, userId }) => {
  const foundLive = await livestreamRepo.findLiveByIdAndType(liveId, 'active')
  if (!foundLive) throw new ApiError(StatusCodes.NOT_FOUND, 'live is end')
  const token = agoraHelper.generateToken({
    channelName: liveId.toString(),
    account: userId.toString(),
    roleType: 'AUDIENCE'
  })
  return {
    token,
    shopId: foundLive.shopId,
    channelName: liveId.toString()
  }
}

const endLive = async ({ userId, liveId }) => {
  const foundLive = await livestreamModel.findById(liveId).lean()
  if (!foundLive || foundLive.live_streamerId.toString() !== userId.toString()) throw new ApiError(StatusCodes.BAD_REQUEST, 'live session invalid')
  if (foundLive.live_status === 'ended') return foundLive

  const [finalView, finalLike] = await Promise.all([
    redisClient.get(`${PREFIX.LIVE_PEAK_VIEWERS}:${foundLive.live_code}`),
    redisClient.get(`${PREFIX.LIVE_LIKES}:${foundLive.live_code}`)
  ])
  const finalLive = await livestreamModel.findOneAndUpdate({ _id: converter.toObjectId(liveId) },
    {
      live_status: 'ended',
      live_actual_end: Date.now(),
      'live_metrics.total_likes': Number(finalLike) || 0,
      'live_metrics.peak_viewers': Number(finalView) || 0,
      'live_metrics.viewer_count': 0
    },
    { returnDocument: 'after' }
  )
  await Promise.all([
    redisClient.del(`${PREFIX.LIVE_VIEWERS}:${foundLive.live_code}`),
    redisClient.del(`${PREFIX.LIVE_LIKES}:${foundLive.live_code}`),
    redisClient.del(`${PREFIX.LIVE_PEAK_VIEWERS}:${foundLive.live_code}`)
  ])

  return finalLive
}

const getActiveSessions = async ({ limit = 5, cursor }) => {
  let query = { live_status: 'active' }
  if (cursor) query.startedAt = { $lt: new Date(cursor) }
  const lives = await livestreamModel.find(query)
    .populate('live_shopId', 'shop_name shop_logo')
    .sort({ 'live_actual_start': -1 })
    .limit(limit)
    .lean()

  const nextCursor = lives.length > 0 ? lives[lives.length - 1].startedAt : null
  return {
    lives,
    nextCursor,
    hasMore: lives.length === limit
  }
}

const pinProduct = async ({ userId, liveId, productId }) => {
  const foundLive = await livestreamModel.findById(liveId).lean()
  if (!foundLive || foundLive.live_streamerId.toString() !== userId.toString()) throw new ApiError(StatusCodes.BAD_REQUEST, 'live session invalid')
  await livestreamModel.findOneAndUpdate(
    { _id: liveId },
    { $set: { 'live_products.$[].is_featured': false, } },
    { new: true }
  )
  const finalUpdate = await livestreamModel.findOneAndUpdate(
    { _id: liveId, 'live_products.productId': productId },
    { $set: { 'live_products.$.is_featured': true } },
    { new: true }
  ).lean()

  const pinnedProduct = finalUpdate.live_products.find(item => item.productId.toString() === productId)
  socketService.pinnedProductPopup(pinnedProduct, foundLive.live_code)
  return pinnedProduct
}

const unpinProduct = async ({ userId, liveId }) => {
  const foundLive = await livestreamModel.findById(liveId).lean()
  if (!foundLive || foundLive.live_streamerId.toString() !== userId.toString()) throw new ApiError(StatusCodes.BAD_REQUEST, 'live session invalid')
  await livestreamModel.findOneAndUpdate(
    { _id: liveId },
    { $set: { 'live_products.$[].is_featured': false, } },
    { new: true }
  )
}

const addProductToLiveSession = async ({ products, liveId, shopId }) => {

  const skuIds = products.flatMap(p => p.skus.map(s => s.sku_id))
  const [foundLive, foundSkus] = await Promise.all([
    livestreamRepo.findLiveByIdAndShopId(liveId, shopId),
    skuService.getSkusDetails(skuIds)
  ])
  if (!foundLive) throw new ApiError(StatusCodes.BAD_REQUEST, 'Live does not existss!')

  const liveProducts = products.map(reqProduct => {
    const skus = reqProduct.skus.map(reqSku => {
      const foundSku = foundSkus.find(s => s.sku_id === reqSku.sku_id)
      if (!foundSku) throw new ApiError(StatusCodes.BAD_REQUEST, `SKU ${reqSku.sku_id} not found`)

      return {
        skuId: foundSku.sku_id,
        sku_name: foundSku.sku_attributes,
        original_price: foundSku.sku_price,
        live_price: reqSku.live_price,
      }
    })
    const firstSku = foundSkus.find(s => s.product_id === reqProduct.spu_id)
    return {
      productId: firstSku.product_id,
      name: firstSku.product_name,
      thumb: firstSku.sku_image,
      is_featured: reqProduct.is_featured || false,
      skus,
    }
  })

  return await livestreamRepo.addProductToLiveSession(foundLive._id, liveProducts)
}

const updateLiveSession = async ({ liveId, reqBody }) => {
  const foundLive = await livestreamRepo.findLiveByIdAndType(liveId, 'scheduled')
  if (!foundLive) throw new ApiError(StatusCodes.BAD_REQUEST, 'Live does not existss!')

  const allowedFields = ['live_title', 'live_description', 'live_scheduledAt']
  const updateData = {}
  Object.keys(reqBody).forEach(key => {
    if (allowedFields.includes(key) && reqBody[key] !== undefined) {
      updateData[key] = reqBody[key]
    }
  })
  await livestreamModel.findOneAndUpdate(
    { _id: foundLive._id },
    { $set: updateData },
    { returnDocument: 'after' }
  ).lean()
}

const cancelLiveSession = async ({ liveId }) => {
  const foundLive = await livestreamRepo.findLiveByIdAndType(liveId, 'scheduled')
  if (!foundLive) throw new ApiError(StatusCodes.BAD_REQUEST, 'Live does not existss!')

  await livestreamModel.findOneAndUpdate(
    { _id: foundLive._id },
    { $set: { live_status: 'canceled' } },
    { returnDocument: 'after' }
  ).lean()
}

const getHistoryLiveByShop = async ({ shopId, limit = 50, page = 1, status = 'all' }) => {
  const skip = (page - 1) * limit
  const filter = { live_shopId: converter.toObjectId(shopId) }

  if (status !== 'all') filter.live_status = status
  console.log("🚀 ~ getHistoryLiveByShop ~ filter:", filter)
  const [lives, totalItems] = await Promise.all([
    livestreamRepo.findAllLiveSession({ skip, limit, filter }),
    livestreamModel.countDocuments({ live_shopId: converter.toObjectId(shopId) })
  ])
  return {
    lives,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: Number(page)
  }
}


export default {
  createLiveSession,
  startLive,
  joinLive,
  endLive,
  pinProduct,
  unpinProduct,
  getActiveSessions,
  addProductToLiveSession,
  updateLiveSession,
  cancelLiveSession,
  getHistoryLiveByShop
}