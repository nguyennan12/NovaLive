import Joi from 'joi'
import {
  PRODUCT_NAME_RULE,
  PRODUCT_NAME_MESSAGE,
  IMAGE_URL_RULE,
  IMAGE_URL_RULE_MESSAGE,
  PRODUCT_PRICE_RULE,
  PRODUCT_PRICE_MESSAGE,
  PRODUCT_QUANTITY_RULE,
  PRODUCT_QUANTITY_MESSAGE,
  PRODUCT_TYPE_VALUES,
  PRODUCT_TYPE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PRODUCT_ATTRIBUTES_RULE,
  PRODUCT_ATTRIBUTES_MESSAGE
} from '#utils/validator.js'

export const productValidation = {
  create: {
    body: Joi.object({
      product_name: Joi.string().min(PRODUCT_NAME_RULE.min).max(PRODUCT_NAME_RULE.max).required().messages(PRODUCT_NAME_MESSAGE),
      product_thumb: Joi.string().required().pattern(IMAGE_URL_RULE).messages(IMAGE_URL_RULE_MESSAGE),
      product_price: Joi.number().min(PRODUCT_PRICE_RULE.min).required().messages(PRODUCT_PRICE_MESSAGE),
      product_quantity: Joi.number().min(PRODUCT_QUANTITY_RULE.min).required().messages(PRODUCT_QUANTITY_MESSAGE),
      product_type: Joi.string().valid(...PRODUCT_TYPE_VALUES).required().messages(PRODUCT_TYPE_MESSAGE),
      product_shopId: Joi.string().pattern(OBJECT_ID_RULE).required().messages(OBJECT_ID_RULE_MESSAGE),
      product_attributes: Joi.object().min(PRODUCT_ATTRIBUTES_RULE.min).required().messages(PRODUCT_ATTRIBUTES_MESSAGE),
    }).unknown(true)
  },
  paramsProductId: {
    params: {
      product_shopId: Joi.string().pattern(OBJECT_ID_RULE).required().messages(OBJECT_ID_RULE_MESSAGE),
    }
  }
}