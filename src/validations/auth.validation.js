import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE, OTP_TOKEN_RULE, OTP_TOKEN_RULE_MESSAGE } from '#utils/validator.js'

const signUp = {
  body: Joi.object().keys({
    email: Joi.string().required().pattern(EMAIL_RULE).messages(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).messages(PASSWORD_RULE_MESSAGE)
  })
}

const verify = {
  body: Joi.object().keys({
    email: Joi.string().required().pattern(EMAIL_RULE).messages(EMAIL_RULE_MESSAGE),
    otpToken: Joi.string().required().pattern(OTP_TOKEN_RULE).messages(OTP_TOKEN_RULE_MESSAGE)
  })
}

export default {
  signUp,
  verify
}