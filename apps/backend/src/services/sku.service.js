import ApiError from '#core/error.response.js'
import { redisClient } from '#database/init.redis.js'
import shopRepo from '#models/repository/shop.repo.js'
import spuRepo from '#models/repository/spu.repo.js'
import { skuModel } from '#models/sku.model.js'
import { spuModel } from '#models/spu.model.js'
import { PREFIX } from '#utils/constant.js'
import converter from '#utils/converter.js'
import { getMinPriceFromSkus, getNameSkuByTierOption } from '#utils/data.js'
import { generateSkuId } from '#utils/generator.js'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'


const createSku = async ({ spu_id, sku_list, spu_code }) => {
  try {
    const skuList = sku_list.map(sku => {
      return { ...sku, sku_spuId: spu_id, sku_name: getNameSkuByTierOption(sku.tier_options), sku_id: generateSkuId(spu_code, sku.sku_tier_idx) }
    })
    //create 1 mảng array cái sku
    const newSku = await skuModel.create(skuList)
    return newSku
  } catch (error) {
    console.log(error.message)
    return []
  }
}

const getOneSku = async ({ skuId, spuId }) => {
  let spuObjectId = spuId
  const foundProduct = await spuRepo.findBySpuId(spuId)
  if (foundProduct) spuObjectId = foundProduct._id

  const cacheKey = `${PREFIX.SKU}:${spuObjectId}:${skuId}`
  const cacheData = await redisClient.get(cacheKey)
  if (cacheData) return JSON.parse(cacheData)

  const sku = await skuModel.findOne({ sku_id: skuId, sku_spuId: spuObjectId, isDeleted: false }).lean()
  if (sku) await redisClient.setEx(cacheKey, 3600, JSON.stringify(sku))
  return _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted'])
}

const getAllSkuBySpuId = async (spuId) => {
  const foundProduct = await spuRepo.findProductById(spuId)
  if (!foundProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'Product does not exists!')
  return await skuModel.find({ sku_spuId: foundProduct._id }).lean()
}

//này up date toàn bộ sku list tương ứng với variation
const updateSkuBySpuId = async ({ spuId, spuCode, skuList }) => {
  //tạo danh sách sku mới từ sku list truyền vào
  const newSkuIds = skuList.map(sku => generateSkuId(spuCode, sku.sku_tier_idx))

  //tạo mảng bulk option updateOne tất cả cái sku mới
  const bulkOps = skuList.map((newSku, idx) => ({
    updateOne: {
      filter: { sku_id: newSkuIds[idx] },
      update: { $set: { ...newSku, sku_id: newSkuIds[idx], sku_spuId: spuId } },
      upsert: true
    }
  }))

  if (bulkOps.length > 0) await skuModel.bulkWrite(bulkOps)

  //xóa tất cả sku cũ không có trong sku list mới
  skuModel.deleteMany({
    sku_spuId: spuId,
    sku_id: { $nin: newSkuIds }
  })

  return await skuModel.find({ sku_spuId: spuId }).lean()
}

//update field bên trong sku không làm thay đổi tier idx của nó
const updateSingleSku = async ({ spuId, skuId, payload, userId }) => {
  //check trước khi update
  const foundProduct = await spuRepo.findProductDetail(spuId)
  if (!foundProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product does not exist!')
  const foundShop = await shopRepo.findShopByIdAndOwnId({ shopId: foundProduct.spu_shopId, ownId: userId })
  if (!foundShop) throw new ApiError(StatusCodes.FORBIDDEN, 'No permission!')

  //các field được update
  const allowedData = _.pick(payload, ['sku_price', 'sku_stock', 'sku_thumb', 'sku_name'])

  const updatedSku = await skuModel.findOneAndUpdate(
    { sku_id: skuId, sku_spuId: foundProduct._id },
    allowedData,
    { new: true }
  )
  if (!updatedSku) throw new ApiError(StatusCodes.NOT_FOUND, 'SKU not found!')

  //update giá
  if (payload.sku_price) {
    const allSkus = await skuModel.find({ sku_spuId: foundProduct._id })
    await spuModel.findOneAndUpdate({ _id: foundProduct._id }, {
      spu_price: getMinPriceFromSkus(allSkus)
    })
  }

  return updatedSku
}


//lấy danh sách sku chi tiết
const getSkusDetails = async (skuIds) => {
  //mảng lưu các sku ids
  const objectIds = skuIds.map(id => converter.toObjectId(id))
  //tìm những sku có trong skuIds
  const skus = await skuModel.find({ _id: { $in: objectIds } })
    .populate({
      path: 'sku_spuId',//liên kết tới Spu schema
      select: 'spu_name spu_thumb spu_shopId', // lấy ra name thumb và shopId
      populate: {
        path: 'spu_shopId',//liên kết từ spu tới shop
        select: 'shop_name' //lấy shop name
      }
    })
    .lean()

  //trả về 1 mảng object theo format
  const formattedData = skus.map(sku => {
    return {
      sku_id: sku._id.toString(),
      sku_price: sku.sku_price,
      sku_image: sku.sku_image || sku.sku_spuId.spu_thumb,
      sku_attributes: sku.sku_attributes,
      product_id: sku.sku_spuId._id.toString(),
      product_name: sku.sku_spuId.spu_name,
      shopId: sku.sku_spuId.spu_shopId._id.toString(),
      shop_name: sku.sku_spuId.spu_shopId.shop_name
    }
  })

  return formattedData
}

export default {
  createSku,
  getOneSku,
  getAllSkuBySpuId,
  updateSkuBySpuId,
  updateSingleSku,
  getSkusDetails
}