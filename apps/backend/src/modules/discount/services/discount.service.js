import { redisClient } from '#infrastructure/database/init.redis.js'
import discountModel from '#modules/discount/models/discount.model.js'
import discountRepo from '#modules/discount/repos/discount.repo.js'
import { generateDisId } from '#shared/utils/generator.js'
import { DiscountValidate } from '#shared/helpers/discount.helper.js'
import converter from '#shared/utils/converter.js'
import { PREFIX } from '#shared/utils/constant.js'
import spuRepo from '#modules/product/repos/spu.repo.js'
import ApiError from '#shared/core/error.response.js'
import { StatusCodes } from 'http-status-codes'


const craeteDiscount = async (reqBody) => {
  const { discount_end_date, discount_max_uses, discount_shopId } = reqBody
  const checkDiscount = new DiscountValidate(reqBody).checkDate()
  const discountCode = generateDisId()
  const discount_scope = discount_shopId ? 'shop' : 'global'
  const newDiscount = await discountModel.create(
    {
      discount_code: discountCode,
      discount_scope,
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

const queryDiscounts = async ({ page = 1, limit = 20, scope = '', shopId = '', search = '', status = 'all', type = 'all', target = 'all' }) => {
  return await discountRepo.queryDiscounts({ page, limit, scope, shopId, search, status, type, target })
}

const getAllDiscountOfShop = async ({ shopId, limit = 30, offset = 0 }) => {
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

const markDiscountsAsUsed = async (discountCodes, userId) => {
  if (!discountCodes?.length) return
  const ops = discountCodes.map(code => ({
    updateOne: {
      filter: { discount_code: code },
      update: {
        $addToSet: { discount_users_used: converter.toObjectId(userId) },
        $inc: { discount_max_uses: -1, discount_uses_count: 1 }
      }
    }
  }))
  await discountModel.bulkWrite(ops)
}

const cancelDiscountCode = async (discountCodes, userId, session) => {
  if (!discountCodes || discountCodes.length === 0) return
  const rollbackOps = discountCodes.map(code => ({
    updateOne: {
      filter: { discount_code: code, discount_users_used: converter.toObjectId(userId) },
      update: {
        $pull: { discount_users_used: converter.toObjectId(userId) },
        $inc: { discount_max_uses: 1, discount_uses_count: -1 }
      },
    }
  }))
  await discountModel.bulkWrite(rollbackOps, { session })
}

const getDiscountAmout = async ({ reqBody }) => {
  const { code, totalOrder } = reqBody
  const foundDiscount = await discountRepo.findDiscoutByCode(code)
  if (!foundDiscount) throw (new ApiError(StatusCodes.BAD_REQUEST, 'Discount does not exists'))

  const { discount_type, discount_value } = foundDiscount
  let amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
  if (amount > foundDiscount.discount_max_value) amount = foundDiscount.discount_max_value

  return {
    totalOrder,
    discountAmout: amount,
    priceApplyDiscount: totalOrder - amount
  }
}

const applyDiscounts = async ({ userId, productDiscountCode, shippingDiscountCode, productOrderTotal, shippingOrderTotal }) => {
  const [discountProductResult, discountShippingResult] = await Promise.all([
    productDiscountCode
      ? getDiscountAmout({
        userId,
        reqBody: { code: productDiscountCode, totalOrder: productOrderTotal },
      })
      : Promise.resolve(null),

    shippingDiscountCode
      ? getDiscountAmout({
        userId,
        reqBody: { code: shippingDiscountCode, totalOrder: shippingOrderTotal },
      })
      : Promise.resolve(null),
  ])
  const amountDiscountProduct = discountProductResult?.discountAmout ?? 0
  const amountDiscountShipping = discountShippingResult?.discountAmout ?? 0

  return { amountDiscountProduct, amountDiscountShipping }
}

const checkDiscountAvailable = async ({ discountCode, userId, totalOrder }) => {
  const foundDiscount = await discountRepo.findDiscoutByCode(discountCode)
  if (!foundDiscount) throw (new ApiError(StatusCodes.BAD_REQUEST, 'Discount does not exists'))

  new DiscountValidate(foundDiscount)
    .checkMinOrder(totalOrder)
    .isLimitByUser(userId)
    .isNotExpired()
    .isOverLimit()
    .isActive()

  return true
}


export default {
  craeteDiscount,
  getAllDiscount,
  queryDiscounts,
  getAllDiscountOfShop,
  getProductsByDiscount,
  deleteDiscount,
  updateDiscount,
  markDiscountsAsUsed,
  cancelDiscountCode,
  getDiscountAmout,
  applyDiscounts,
  checkDiscountAvailable
}