import CategoryModel from '#models/category.model.js'


const findAllCategoryByParentId = async (parentId) => {
  return await CategoryModel.find({ cat_parentId: parentId }).lean()
}

const findCattegoryParent = async (parentId) => {
  return await CategoryModel.findOne({ cat_parentId: parentId }).lean()
}

export default {
  findAllCategoryByParentId,
  findCattegoryParent
}