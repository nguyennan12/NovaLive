import ApiError from '#core/error.response.js'
import converter from '#utils/converter.js'
import { StatusCodes } from 'http-status-codes'

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
      const userUsageCount = this.discount.discount_users_used.filter(id => converter.toObjectId(id) === converter.toObjectId(userId)).length

      if (userUsageCount >= this.discount.discount_max_uses_per_user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'You have reached your limit for this code!')
      }
    }
    return this
  }
  checkShopOwnership(shopId) {
    if (shopId && this.discount_scope === 'shop') {
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