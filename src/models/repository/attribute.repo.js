import attributeModel from '#models/attribute.model.js'

const findAttributeById = async (attributeId) => {
  return await attributeModel.findOne({ attr_id: attributeId }).lean()
}

export default {
  findAttributeById
}