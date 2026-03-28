import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'

const findOneOrThrow = async ({ model, filter }) => {
  const doc = await model.findOne(filter).lean()
  if (!doc) throw new ApiError(StatusCodes.BAD_REQUEST, `${model.modelNam} does not exists!`)
  return doc
}

export default {
  findOneOrThrow
}