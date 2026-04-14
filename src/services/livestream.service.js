import ApiError from '#core/error.response.js'
import { redisClient } from '#database/init.redis.js'
import livestreamModel from '#models/livestream.model.js'
import { PREFIX } from '#utils/constant.js'
import converter from '#utils/converter.js'
import { generateLiveId } from '#utils/generator.js'
import { StatusCodes } from 'http-status-codes'
import skuService from './sku.service.js'

const createLiveSession = async ({ userId, reqBody }) => {
  const { title, description, products } = reqBody
  const skuIds = products.flatMap(p => p.skus.map(s => s.sku_id))
  const foundSkus = await skuService.getSkusDetails(skuIds)

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
  const newLive = await livestreamModel.create({
    live_title: title,
    live_description: description,
    live_products: liveProducts,
    live_streamerId: userId,
    live_code: generateLiveId()
  })
  return newLive
}

const startLive = async ({ userId, liveId }) => {
  const foundLive = await livestreamModel.findById(liveId).lean()
  if (!foundLive || foundLive.live_streamerId.toString() !== userId.toString()) throw new ApiError(StatusCodes.BAD_REQUEST, 'live session invalid')
  await Promise.all([
    livestreamModel.findOneAndUpdate({ _id: liveId }, { live_status: 'active', live_actual_start: Date.now() }, { returnDocument: 'after' }),
    redisClient.set(`${PREFIX.LIVE_VIEWERS}:${foundLive.live_code}`, 0)
  ])
  return { ...foundLive }
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

export default {
  createLiveSession,
  startLive,
  endLive
}