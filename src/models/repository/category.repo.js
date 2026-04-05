import CategoryModel from '#models/category.model.js'


const findAllCategoryByParentId = async (parentId) => {
  return await CategoryModel.find({ cat_parentId: parentId }).lean()
}

const findCattegoryById = async (categoryId) => {
  return await CategoryModel.findOne({ cat_id: categoryId }).lean()
}

export default {
  findAllCategoryByParentId,
  findCattegoryById
}