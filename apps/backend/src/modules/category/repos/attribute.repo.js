import attributeModel from '#modules/category/models/attribute.model.js'

const findAttributeById = async (attributeId) => {
  return await attributeModel.findOne({ attr_id: attributeId }).lean()
}
const findAttributesByIds = async (attributeIds) => {
  return await attributeModel.find({ attr_id: { $in: attributeIds } }).lean()
}

const findAtributeByIds = async (attrIds) => {
  return await attributeModel
    .find({ attr_id: { $in: [...attrIds] }, isDeleted: false })
    .lean()
}
export default {
  findAttributeById,
  findAtributeByIds,
  findAttributesByIds
}