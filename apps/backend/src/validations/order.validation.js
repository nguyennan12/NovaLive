import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '#shared/utils/validator.js'

const objectId = Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE)

const itemProductSchema = Joi.object({
  skuId: objectId.required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0),
  name: Joi.string(),
  thumb: Joi.string()
})

const shopDiscountSchema = Joi.object({
  target: Joi.string().valid('product', 'freeship').required(),
  code: Joi.string().required()
})

const shopOrderSchema = Joi.object({
  shopId: objectId.required(),
  item_products: Joi.array().items(itemProductSchema).min(1).required(),
  shop_discount: Joi.array().items(shopDiscountSchema).default([])
})

const checkoutBodyBase = {
  userAddressId: objectId,
  cartId: objectId.allow(null, ''),
  shopOrderIds: Joi.array().items(shopOrderSchema).min(1).required(),
  productDiscountCode: Joi.string().allow(null, ''),
  shippingDiscountCode: Joi.string().allow(null, '')
}

export const checkoutSchema = {
  body: Joi.object(checkoutBodyBase)
}

export const orderByUserSchema = {
  body: Joi.object({
    ...checkoutBodyBase,
    userAddressId: objectId.required(),
    userPayment: Joi.string().valid('cod', 'vnpay', 'stripe', 'momo').default('cod'),
    client_totalCheckout: Joi.number().min(0).required()
  })
}

export const updateOrderStatusSchema = {
  params: Joi.object({
    orderId: objectId.required()
  }),
  body: Joi.object({
    status: Joi.string()
      .valid('pending', 'processing', 'confirmed', 'shipped', 'cancelled', 'delivered')
      .required()
  })
}

export const getMyOrdersSchema = {
  query: Joi.object({
    status: Joi.string().valid('pending', 'processing', 'confirmed', 'shipped', 'cancelled', 'delivered')
  })
}

export const orderParamSchema = {
  params: Joi.object({
    orderId: objectId.required()
  })
}
