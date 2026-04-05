import attributeModel from '#models/attribute.model.js'

const findAttributeById = async (attributeId) => {
  return await attributeModel.findOne({ attr_id: attributeId }).lean()
}

const findAtributeByIds = async (attrIds) => {
  await attributeModel
    .find({ attr_id: { $in: [...attrIds] }, isDeleted: false })
    .lean()
}
export default {
  findAttributeById,
  findAtributeByIds
}