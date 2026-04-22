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

const addAttributesToCategoryBulk = async ({ categoryId, reqBody }) => {
  if (!reqBody || !Array.isArray(reqBody) || reqBody.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid request payload. Expected a non-empty array of attributes.')
  }

  const mappedAttributes = reqBody.map(item => ({
    attr_id: item.attributeId,
    isRequired: item.isRequired,
    displayOrder: item.displayOrder
  }))


  const attributeIds = mappedAttributes.map(attr => attr.attr_id)
  const foundAttrs = await attributeRepo.findAttributesByIds(attributeIds)
  if (foundAttrs.length !== attributeIds.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'One or more attributes not found in the system.')
  }
  const category = await CategoryModel.findOne({ cat_id: categoryId }).lean()
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found.')
  }
  const existingAttrIds = category.cat_attributes.map(attr => attr.attr_id.toString())

  const newAttributes = mappedAttributes.filter(attr =>
    !existingAttrIds.includes(attr.attr_id.toString())
  )

  if (newAttributes.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'All provided attributes already exist in this category.')
  }

  const updatedCategory = await CategoryModel.findOneAndUpdate(
    { cat_id: categoryId },
    {
      $push: {
        cat_attributes: {
          $each: newAttributes
        }
      }
    },
    { new: true, runValidators: true }
  )

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
  getAllCategory,
  addAttributesToCategoryBulk
}