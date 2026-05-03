import discountModel from '#modules/discount/models/discount.model.js'
import _ from 'lodash'

const buildDiscountQuery = ({ scope, shopId, search, status, type, target }) => {
  const query = {}

  if (!_.isNil(scope) && scope !== '') query.discount_scope = scope
  if (!_.isNil(shopId) && shopId !== '') query.discount_shopId = shopId

  const now = new Date()

  if (status === 'active') {
    query.discount_is_active = true
    query.discount_end_date = { $gte: now }
  }

  if (status === 'draft') {
    query.discount_is_active = false
  }

  if (status === 'expired') {
    query.discount_is_active = true
    query.discount_end_date = { $lt: now }
  }

  if (!_.isNil(type) && type !== '') query.discount_type = type
  if (!_.isNil(target) && target !== '') query.discount_target = target

  if (!_.isNil(search) && search.trim() !== '') {
    const keyword = search.trim()
    query.$or = [
      { discount_name: { $regex: keyword, $options: 'i' } },
      { discount_code: { $regex: keyword, $options: 'i' } }
    ]
  }

  return query
}

const findDiscoutByCode = async (discountCode) => {
  return await discountModel.findOne({ discount_code: discountCode }).lean()
}

const findAllDiscountByType = async ({ scope, offset, limit, search, status, type, target }) => {
  const query = buildDiscountQuery({ scope, search, status, type, target })

  const result = await discountModel
    .find(query)
    .sort({ createdAt: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean()

  return result
}

const queryDiscounts = async ({ page = 1, limit = 20, scope = '', shopId = '', search = '', status = 'all', type = 'all', target = 'all' }) => {
  const pageNumber = Number(page)
  const limitNumber = Number(limit)
  const skip = (pageNumber - 1) * limitNumber

  const normalizedType = type === 'all' ? '' : type
  const normalizedTarget = target === 'all' ? '' : target
  const normalizedStatus = status === 'all' ? '' : status

  const query = buildDiscountQuery({
    scope,
    shopId,
    search,
    status: normalizedStatus,
    type: normalizedType,
    target: normalizedTarget
  })

  const [items, totalItems] = await Promise.all([
    discountModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    discountModel.countDocuments(query)
  ])

  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber
  }
}

const updateDiscount = async (discountCode, reqBody) => {
  return await discountModel.findOneAndUpdate(
    { discount_code: discountCode, discount_is_active: true },
    { $set: reqBody },
    { returnDocument: 'after' }
  )
}


export default {
  findDiscoutByCode,
  findAllDiscountByType,
  queryDiscounts,
  updateDiscount
}