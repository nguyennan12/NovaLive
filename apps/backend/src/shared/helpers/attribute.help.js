import ApiError from '#shared/core/error.response.js'
import attributeRepo from '#modules/category/repos/attribute.repo.js'
import categoryRepo from '#modules/category/repos/category.repo.js'
import { StatusCodes } from 'http-status-codes'
import { getOrSetCache } from './redis.helper.js'

export const getCategoryAttributeTemplate = async (categorySlugs = []) => {
  //lấy hàng loạt và nếu k có thì lưu cache (category)
  const categories = await getOrSetCache(
    categorySlugs,
    (slugs) => categoryRepo.findCattegoryBySlugs(slugs),
    'category',
    'cat_slug'
  )
  if (!categories.length) return { templateMap: new Map(), sortedAttrs: [] }

  //danh sách id của attribute
  const attrIds = new Set()
  const catAttrMeta = {} //data trả về
  for (const cat of categories) {
    for (const attr of cat.cat_attributes) {
      //thêm từng attribute id vào danh sách attrIds, chir lưu 1 lần
      attrIds.add(attr.attr_id)
      //kiem tra xem cái attr có trong map chưa, catAttrMeta[attr.attr_id] là lấy fied của object ấy (cat_attributes.attr_id)
      //nếu gặp lại field đó mà nó required thì ghi đè
      if (!catAttrMeta[attr.attr_id] || attr.isRequired) {
        catAttrMeta[attr.attr_id] = {
          isRequired: attr.isRequired,
          displayOrder: attr.displayOrder ?? 0,
        }
      }
    }
  }
  //lấy hàng loạt và nếu k có thì lưu cache (attribute)
  const attributes = await getOrSetCache(
    [...attrIds],
    (ids) => attributeRepo.findAtributeByIds(ids),
    'attribute',
    'attr_id'
  )

  const templateMap = new Map() //lưu toàn bộ data của 1 attr_id (attr_id: {data}) nghĩa là attribue đó có thông tin gì
  //còn enrichedAttrs = là trả lại các attribute có trong slug category (dạng mảng cái object attribute)
  const enrichedAttrs = attributes.map(attr => {
    const meta = catAttrMeta[attr.attr_id]
    const data = { ...attr, ...meta }
    templateMap.set(attr.attr_id, data)
    return data
  })
  // console.log('🚀 ~ getCategoryAttributeTemplate ~ templateMap:', templateMap)
  return {
    templateMap,
    sortedAttrs: enrichedAttrs.sort((a, b) => a.displayOrder - b.displayOrder)
  }
}

export const validateAndNormalizeAttributes = async ({ spu_attributes = [], spu_category = [] }) => {
  const { templateMap } = await getCategoryAttributeTemplate(spu_category)
  if (templateMap.size === 0) throw new ApiError(StatusCodes.BAD_REQUEST, 'Categories invalid')

  //id là Key (attr_id) dataAttr là data (các field của attribute)
  for (const [id, dataAttr] of templateMap) {
    if (dataAttr.isRequired && !spu_attributes.some(a => a.attr_id === id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `${dataAttr.attr_name} is require`)
    }
  }

  return spu_attributes.map(attr => {
    //lấy ra cái attribute trong các category có khớp với của spu truyền vào không
    const dataAttr = templateMap.get(attr.attr_id)
    if (!dataAttr) throw new ApiError(StatusCodes.BAD_REQUEST, `Attribute ${attr.attr_id} not found`)

    //kiểm tra xem attribute có phải là select k? và nếu là select thì cái option của
    //spu_attribute truyền vào cos nằm trong option của dataAttr không?
    if (dataAttr.attr_type === 'select' && !dataAttr.attr_options.includes(attr.attr_value)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Value invalid for ${dataAttr.attr_name}`)
    }

    return {
      attr_id: dataAttr.attr_id,
      attr_name: dataAttr.attr_name,
      attr_value: attr.attr_value
    }
  })
}