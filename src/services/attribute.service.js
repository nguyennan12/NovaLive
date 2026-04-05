import ApiError from '#core/error.response.js'
import attributeModel from '#models/attribute.model.js'
import { StatusCodes } from 'http-status-codes'


const createAttribute = async (payload) => {
  const { attr_name, attr_type, attr_options } = payload

  if (['select', 'multi-select'].includes(attr_type) && !attr_options?.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Type "${attr_type}" must have attr_options`)
  }

  const existed = await attributeModel.findOne({ attr_name }).lean()
  if (existed) throw new ApiError(StatusCodes.BAD_REQUEST, 'Attribute name already exists')

  return await attributeModel.create(payload)
}

const createAttributeBulk = async (attrArray) => {
  const results = []
  for (const item of attrArray) {
    if (['select', 'multi-select'].includes(item.attr_type) && !item.attr_options?.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Type "${item.attr_type}" must have attr_options`)
    }

    const existed = await attributeModel.findOne({ attr_name: item.attr_name }).lean()
    if (existed) throw new ApiError(StatusCodes.BAD_REQUEST, 'Attribute name already exists')
    const newAtrr = await attributeModel.create(item)
    results.push(newAtrr)
  }
  return results
}


export default {
  createAttribute,
  createAttributeBulk,
}