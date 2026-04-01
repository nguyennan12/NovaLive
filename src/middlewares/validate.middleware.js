import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import _ from 'lodash'

const validate = (schema) => (req, res, next) => {
  const validSchema = _.pick(schema, ['body', 'query', 'params'])
  const object = _.pick(req, Object.keys(validSchema))

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object)

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message.replace(/['"]/g, ''))
      .join(', ')

    return next(new ApiError(StatusCodes.BAD_REQUEST, errorMessage))
  }
  Object.assign(req, value)

  return next()
}

export default validate