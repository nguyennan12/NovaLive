import ApiError from '#core/error.response.js'
import shopRepo from '#models/repository/shop.repo.js'
import { spuModel } from '#models/spu.model.js'
import { generateSpuId } from '#utils/data.js'
import { StatusCodes } from 'http-status-codes'
import skuService from './sku.service.js'


const createSpu = async ({ reqBody, ownId }) => {
  console.log('🚀 ~ createSpu ~ reqBody:', reqBody)
  const { spu_id,
    spu_shopId,
    spu_attributes,
    spu_variations,
    sku_list,
    ...spuData } = reqBody
  console.log('🚀 ~ createSpu ~ sku_list:', sku_list)
  console.log('🚀 ~ createSpu ~ spuData:', spuData)

  const foundShop = await shopRepo.findShopByIdAndOwnId({ shopId: spu_shopId, ownId: ownId })
  if (!foundShop) throw new ApiError(StatusCodes.BAD_REQUEST, 'Shop does not exists!')

  const newSpu = await spuModel.create({
    spu_id: generateSpuId(spu_id),
    ...spuData,
    spu_shopId,
    spu_attributes,
    sku_list,
    spu_variations
  })

  if (newSpu && sku_list.length) {
    await skuService.createSku({ spu_id: newSpu.spu_id, sku_list })
  }
  return newSpu
}

export default {
  createSpu
}