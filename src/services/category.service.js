import categoryRepo from '#models/repository/category.repo.js'
import CategoryModel from '#models/category.model.js'
import slugify from 'slugify'

const createCategory = async (categoryArray) => {
  const results = []
  const sortedArray = categoryArray.sort((a, b) => (a.parentId === null ? -1 : 1))
  for (const item of sortedArray) {
    let level = 1
    if (item.parentId) {
      const parent = await categoryRepo.findCattegoryParent(item.parentId)
      if (parent) {
        level = parent.cat_level + 1
      }
    }
    const newCat = await CategoryModel.create({
      cat_name: item.name,
      cat_id: item.cat_id,
      cat_slug: slugify(item.name, { lower: true }),
      cat_parentId: item.parentId,
      cat_level: level
    })
    results.push(newCat)
  }
  return results
}

const getAllCategory = async () => {
  return await CategoryModel.find({}).lean()
}

export default {
  createCategory,
  getAllCategory
}