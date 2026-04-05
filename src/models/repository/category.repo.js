import CategoryModel from '#models/category.model.js'


const findAllCategoryByParentId = async (parentId) => {
  return await CategoryModel.find({ cat_parentId: parentId }).lean()
}

const findCattegoryById = async (categoryId) => {
  return await CategoryModel.findOne({ cat_id: categoryId }).lean()
}

const findCattegoryBySlugs = async (slug) => {
  return await CategoryModel.find({ cat_slug: { $in: slug }, cat_isDeleted: false }).select('cat_attributes').lean()
}

export default {
  findAllCategoryByParentId,
  findCattegoryById,
  findCattegoryBySlugs
}