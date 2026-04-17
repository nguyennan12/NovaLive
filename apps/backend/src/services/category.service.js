/* eslint-disable no-unused-vars */
import ApiError from '#core/error.response.js'
import CategoryModel from '#models/category.model.js'
import attributeRepo from '#models/repository/attribute.repo.js'
import categoryRepo from '#models/repository/category.repo.js'
import { generateCatId } from '#utils/generator.js'
import { StatusCodes } from 'http-status-codes'
import { getCategoryAttributeTemplate } from '#helpers/attribute.help.js'

const createCategory = async ({ name, parentId = null }) => {
  let level = 1
  let catId = generateCatId()
  if (parentId) {
    const parent = await categoryRepo.findCattegoryById(parentId)
    if (parent) {
      level = parent.cat_level + 1
      catId = `${generateCatId()}-${level}`
    }
  }
  return await CategoryModel.create({
    cat_name: name,
    cat_id: catId,
    cat_parentId: parentId,
    cat_level: level
  })
}
const createCategoryBulk = async (categoryArray) => {
  const results = []
  const sortedArray = categoryArray.sort((a, b) => (a.parentId === null ? -1 : 1))
  for (const item of sortedArray) {
    let level = 1
    let catId = generateCatId()
    if (item.parentId) {
      const parent = await categoryRepo.findCattegoryById(item.parentId)
      if (parent) {
        level = parent.cat_level + 1
        catId = `${generateCatId()}-${level}`
      }
    }
    const newCat = await CategoryModel.create({
      cat_name: item.name,
      cat_id: catId,
      cat_parentId: item.parentId,
      cat_level: level
    })
    results.push(newCat)
  }
  return results
}

const addAttributeToCategory = async ({ categoryId, reqBody }) => {
  const { attributeId, isRequired, displayOrder } = reqBody
  console.log('🚀 ~ addAttributeToCategory ~ attributeId:', attributeId)
  const foundAttr = await attributeRepo.findAttributeById(attributeId)
  if (!foundAttr) throw new ApiError(StatusCodes.BAD_REQUEST, 'Attribute not found')
  const updatedCategory = await CategoryModel.findOneAndUpdate(
    {
      cat_id: categoryId,
      'cat_attributes.attr_id': { $ne: attributeId }
    },
    {
      $push: {
        cat_attributes: {
          attr_id: attributeId,
          isRequired,
          displayOrder
        }
      }
    },
    { new: true, runValidators: true }
  )
  if (!updatedCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category not found or Attribute already exists in this category')
  }
  return updatedCategory
}

const getAttributeByCategorySlug = async (slug = []) => {
  const { sortedAttrs } = await getCategoryAttributeTemplate(slug)
  if (!sortedAttrs.length) throw new ApiError(StatusCodes.BAD_REQUEST, 'Not found')
  return sortedAttrs
}

const getAllCategory = async () => {
  return await CategoryModel.find({}).lean()
}

export default {
  createCategory,
  createCategoryBulk,
  addAttributeToCategory,
  getAttributeByCategorySlug,
  getAllCategory
}