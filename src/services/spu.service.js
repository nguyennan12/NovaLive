import ApiError from '#core/error.response.js'
import shopRepo from '#models/repository/shop.repo.js'
import { spuModel } from '#models/spu.model.js'
import { generateSpuId } from '#utils/generator.js'
import { StatusCodes } from 'http-status-codes'
import skuService from './sku.service.js'
import { validateAndNormalizeAttributes } from '#helpers/attribute.help.js'


const createSpu = async ({ reqBody, ownId }) => {
  const { spu_id,
    spu_shopId,
    spu_attributes,
    spu_variations,
    spu_category,
    sku_list,
    ...spuData } = reqBody

  const [foundShop, normalizedAttrs] = await Promise.all([
    shopRepo.findShopByIdAndOwnId({ shopId: spu_shopId, ownId }),
    validateAndNormalizeAttributes({ spu_attributes, spu_category })
  ])

  if (!foundShop) throw new ApiError(StatusCodes.BAD_REQUEST, 'Shop does not exists!')

  const newSpu = await spuModel.create({
    spu_id: generateSpuId(spu_id),
    ...spuData,
    spu_shopId,
    spu_attributes: normalizedAttrs,
    spu_variations,
    spu_price: Math.min(...sku_list.map(s => s.sku_price)),
    spu_quantity: sku_list.reduce((sum, s) => sum + s.sku_stock, 0),
  })

  if (newSpu && sku_list.length) {
    await skuService.createSku({ spu_id: newSpu.spu_id, sku_list })
  }
  return newSpu
}

export default {
  createSpu
}