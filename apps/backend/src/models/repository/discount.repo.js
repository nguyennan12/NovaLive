import discountModel from '#models/discount.model.js'
import _ from 'lodash'

const findDiscoutByCode = async (discountCode) => {
  return await discountModel.findOne({ discount_code: discountCode }).lean()
}

const findAllDiscountByType = async ({ scope, offset, limit }) => {
  const query = { discount_is_active: true }
  if (!_.isNil(scope) && scope !== '') query.discount_scope = scope

  const result = await discountModel
    .find(query)
    .sort({ createdAt: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean()

  return result
}

const updateDiscount = async (discountCode, reqBody) => {
  return await discountModel.findOneAndUpdate(
    { discount_code: discountCode, discount_is_active: true },
    { reqBody },
    { returnDocument: 'after' }
  )
}


export default {
  findDiscoutByCode,
  findAllDiscountByType,
  updateDiscount
}