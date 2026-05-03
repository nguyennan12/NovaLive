import Joi from 'joi'
import ApiError from '#shared/core/error.response.js'
import converter from '#shared/utils/converter.js'
import { StatusCodes } from 'http-status-codes'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '#shared/utils/validator.js'

// ─── Joi Schemas ──────────────────────────────────────────────────────────────

const discountBase = {
  discount_name: Joi.string(),
  discount_description: Joi.string(),
  discount_start_date: Joi.date().iso(),
  discount_end_date: Joi.date().iso(),
  discount_is_active: Joi.boolean().default(true),
  discount_target: Joi.string().valid('product', 'shipping').default('product'),
  discount_type: Joi.string().valid('percentage', 'fixed_amount').default('fixed_amount'),
  discount_applies_to: Joi.string().valid('all', 'specific').default('all'),
  discount_scope: Joi.string().valid('global', 'shop', 'live').default('global'),
  discount_shopId: Joi.string().pattern(OBJECT_ID_RULE).allow(null).messages(OBJECT_ID_RULE_MESSAGE),
  discount_min_value: Joi.number().min(0),
  discount_value: Joi.number().positive(),
  discount_max_value: Joi.number().min(0),
  discount_max_uses: Joi.number().integer().positive(),
  discount_uses_count: Joi.number().integer().min(0).default(0),
  discount_users_used: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE)),
  discount_max_uses_per_user: Joi.number().integer().positive().default(1),
  discount_product_ids: Joi.array().items(Joi.string()).when('discount_applies_to', {
    is: 'specific',
    then: Joi.array().min(1).required(),
    otherwise: Joi.array().default([])
  })
}

export const createDiscountSchema = {
  body: Joi.object({
    ...discountBase,
    discount_code: Joi.string().uppercase().trim().min(3).max(20).required(),
    discount_name: discountBase.discount_name.required(),
    discount_description: discountBase.discount_description.required(),
    discount_start_date: discountBase.discount_start_date.required(),
    discount_end_date: discountBase.discount_end_date.greater(Joi.ref('discount_start_date')).required()
      .messages({ 'date.greater': 'End date must be after start date' }),
    discount_min_value: discountBase.discount_min_value.required(),
    discount_value: discountBase.discount_value.required(),
    discount_max_value: discountBase.discount_max_value.required(),
    discount_max_uses: discountBase.discount_max_uses.required(),
  })
}

export const updateDiscountSchema = {
  params: Joi.object({
    discountCode: Joi.string().required()
  }),
  body: Joi.object({
    ...discountBase,
    discount_code: Joi.string().uppercase().trim().min(3).max(20),
  }).min(1)
}

export const discountCodeParamSchema = {
  params: Joi.object({
    discountCode: Joi.string().required()
  })
}

export const discountAmountSchema = {
  body: Joi.object({
    discountCode: Joi.string().required(),
    totalOrder: Joi.number().min(0).required()
  })
}

// ─── Business Logic Validation Class ─────────────────────────────────────────

export class DiscountValidate {
  constructor(discount) {
    this.discount = discount
  }

  checkDate(startDate, endDate) {
    const start = new Date(startDate || this.discount.discount_start_date)
    const end = new Date(endDate || this.discount.discount_end_date)
    if (start >= end) throw new ApiError(StatusCodes.BAD_REQUEST, 'Start date must be before end date!')
    return this
  }

  isActive() {
    if (!this.discount.discount_is_active) throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount is no longer active!')
    return this
  }

  isOverLimit() {
    const { discount_max_uses, discount_uses_count } = this.discount
    if (discount_uses_count >= discount_max_uses) throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount has been fully used!')
    return this
  }

  isNotExpired() {
    const now = new Date()
    const start = new Date(this.discount.discount_start_date)
    const end = new Date(this.discount.discount_end_date)
    if (now < start) throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount is not yet valid!')
    if (now > end) throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount has expired!')
    return this
  }

  checkMinOrder(totalOrderAmount) {
    if (this.discount.discount_min_order_value > 0 && totalOrderAmount < this.discount.discount_min_order_value) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Order must be at least ${this.discount.discount_min_order_value} to use this discount!`)
    }
    return this
  }

  isLimitByUser(userId) {
    if (this.discount.discount_max_uses_per_user > 0) {
      const userUsageCount = this.discount.discount_users_used.filter(
        id => converter.toObjectId(id).toString() === converter.toObjectId(userId).toString()
      ).length
      if (userUsageCount >= this.discount.discount_max_uses_per_user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'You have reached your limit for this code!')
      }
    }
    return this
  }

  checkShopOwnership(shopId) {
    if (shopId && this.discount.discount_scope === 'shop') {
      const discountShopId = converter.toObjectId(this.discount.discount_shopId)
      const targetShopId = converter.toObjectId(shopId)
      if (!discountShopId.equals(targetShopId)) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Discount does not belong to this shop!')
      }
    }
    return this
  }

  isHot() {
    const { discount_max_uses, discount_start_date, discount_end_date, discount_scope, discount_value, discount_type } = this.discount
    if (discount_max_uses >= 1000) return true
    if (discount_type === 'percent' && discount_value >= 20) return true
    if (discount_type === 'amount' && discount_value >= 200000) return true
    const startDate = new Date(discount_start_date)
    const day = startDate.getDate()
    const month = startDate.getMonth() + 1
    if (day === month) return true
    const durationInHours = (new Date(discount_end_date) - startDate) / (1000 * 60 * 60)
    if (durationInHours > 0 && durationInHours <= 6) return true
    if (discount_scope === 'live') return true
    return false
  }
}
