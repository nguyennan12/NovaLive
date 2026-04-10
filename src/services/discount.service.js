import { redisClient } from '#database/init.redis.js'
import discountModel from '#models/discount.model.js'
import discountRepo from '#models/repository/discount.repo.js'
import { generateDisId } from '#utils/generator.js'
import { DiscountValidate } from '#validations/discount.vallidation.js'
import converter from '#utils/converter.js'
import { PREFIX } from '#utils/constant.js'
import spuRepo from '#models/repository/spu.repo.js'


const craeteDiscount = async (reqBody) => {
  const { discount_end_date, discount_max_uses, discount_scope, discount_shopId } = reqBody
  const checkDiscount = new DiscountValidate(reqBody).checkDate()
  const discountCode = generateDisId()
  const newDiscount = await discountModel.create(
    {
      discount_code: discountCode,
      discount_shopId: converter.toObjectId(discount_shopId),
      ...reqBody
    })
  const ttl = Math.round((new Date(discount_end_date) - new Date()) / 1000)
  if (ttl > 0 && checkDiscount.isHot()) {
    const prefix = `${PREFIX.DISCOUNT}:${discount_scope}:${discountCode}`
    await Promise.all([
      //lưu thông tin chung
      redisClient.hSet(`${prefix}:meta`, {
        type: newDiscount.discount_type,
        value: newDiscount.discount_value,
        min_val: newDiscount.discount_min_value,
        max_val: newDiscount.discount_max_value,
        shopId: discount_shopId ? newDiscount.discount_shopId.toString() : 'system'
      }),
      //lưu số lượng
      redisClient.set(`${prefix}:count`, discount_max_uses),
      //lưu thời gian tự động xóa
      redisClient.expire(`${prefix}:meta`, ttl),
      redisClient.expire(`${prefix}:count`, ttl)
    ])
  }
  return newDiscount
}

const getAllDiscount = async ({ scope = '', limit = 30, offset = 0 }) => {
  return await discountRepo.findAllDiscountByType({ scope, limit, offset })
}

const getAllDiscountOfShop = async (shopId, limit = 30, offset = 0) => {
  return await discountModel.find({ discount_shopId: converter.toObjectId(shopId), discount_is_active: true })
    .sort({ createdAt: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean()
}
const getProductsByDiscount = async (discountCode, limit = 50, page = 1) => {
  const foundDiscount = await discountRepo.findDiscoutByCode(discountCode)
  if (!foundDiscount) throw (new ApiError(StatusCodes.BAD_REQUEST, 'Discount does not exists'))
  const { discount_applies_to, discount_product_ids } = foundDiscount
  const filter = {
    isPublished: true,
    ...(discount_applies_to === 'specific' && { spu_code: { $in: discount_product_ids } })
  }
  return await spuRepo.findAllProducts({ filter, limit, page })
}

const updateDiscount = async ({ discountCode, reqBody }) => {
  const foundDiscount = await discountRepo.findDiscoutByCode(discountCode)
  if (!foundDiscount) throw (new ApiError(StatusCodes.BAD_REQUEST, 'Discount does not exists'))
  return await discountRepo.updateDiscount(discountCode, reqBody)
}

const deleteDiscount = async (discountCode) => {
  const foundDiscount = await discountRepo.findDiscoutByCode(discountCode)
  if (!foundDiscount) throw (new ApiError(StatusCodes.BAD_REQUEST, 'Discount does not exists'))
  return await discountModel.findOneAndUpdate(
    { discount_code: discountCode },
    { $set: { discount_is_active: false, isDeleted: true } }
  )
}

const cancelDiscountCode = async (discountCode, userId) => {
  const foundDiscount = await discountRepo.findDiscoutByCode(discountCode)
  if (!foundDiscount) throw (new ApiError(StatusCodes.BAD_REQUEST, 'Discount does not exists'))
  return await discountModel.findOneAndUpdate(
    { discount_code: discountCode },
    {
      $pull: {
        discount_users_used: converter.toObjectId(userId)
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    }
  )
}

const getDiscountAmout = async ({ userId, reqBody }) => {
  const { code, shopId, products } = reqBody
  const foundDiscount = await discountRepo.findDiscoutByCode(code)
  if (!foundDiscount) throw (new ApiError(StatusCodes.BAD_REQUEST, 'Discount does not exists'))

  const totalOrder = products.reduce((acc, { price, quantity }) => acc + (quantity * price), 0)

  new DiscountValidate(foundDiscount)
    .checkShopOwnership(shopId)
    .checkMinOrder(totalOrder)
    .isLimitByUser(userId)
    .isNotExpired()
    .isOverLimit()
    .isActive()

  const { discount_type, discount_value } = foundDiscount
  const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

  return {
    totalOrder,
    discountAmout: amount,
    totalPrice: totalOrder - amount
  }
}


export default {
  craeteDiscount,
  getAllDiscount,
  getAllDiscountOfShop,
  getProductsByDiscount,
  deleteDiscount,
  updateDiscount,
  cancelDiscountCode,
  getDiscountAmout
}