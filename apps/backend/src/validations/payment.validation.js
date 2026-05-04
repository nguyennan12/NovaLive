import Joi from 'joi'
import { OTP_TOKEN_RULE, OTP_TOKEN_RULE_MESSAGE, EMAIL_RULE, EMAIL_RULE_MESSAGE } from '#shared/utils/validator.js'

export const createPaymentUrlSchema = {
  body: Joi.object({
    orderId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    bankCode: Joi.string().allow('', null),
    language: Joi.string().valid('vn', 'en').default('vn')
  })
}

export const confirmCodSchema = {
  body: Joi.object({
    orderId: Joi.string().required(),
    email: Joi.string().pattern(EMAIL_RULE).required().messages(EMAIL_RULE_MESSAGE),
    otpToken: Joi.string().pattern(OTP_TOKEN_RULE).required().messages(OTP_TOKEN_RULE_MESSAGE)
  })
}
