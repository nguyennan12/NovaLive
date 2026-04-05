import _ from 'lodash'
import slugify from 'slugify'
import { customAlphabet } from 'nanoid'

const getInfo = (fields = [], object = {}) => {
  return _.pick(object, fields)
}

const getNameFromEmail = (email) => email.split('@')[0].replace(/[._]/g, ' ').trim()

const generateUniqueSlug = async (name, model) => {
  const baseSlug = slugify(name, { lower: true, strict: true })
  let slug = baseSlug
  let count = 1
  while (await model.findOne({ shop_slug: slug })) {
    slug = `${baseSlug}-${count++}`
  }
  return slug
}

const getInfoNested = (fields = [], object = {}) => {
  const result = {}

  fields.forEach(field => {
    const value = _.get(object, field)
    if (value !== undefined) {
      _.set(result, field, value)
    }
  })
  return result
}

export const generateSpuId = () => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const nanoid = customAlphabet(alphabet, 8)
  return `SPU-${nanoid()}`
}

export const generateSkuId = (spuId, tierIdx = []) => {
  const spuCore = spuId.split('-')[1] || spuId
  const tierPart = tierIdx.length > 0 ? tierIdx.join('') : '00'
  return `SKU-${spuCore}-${tierPart}`
}

export default {
  getInfo,
  getNameFromEmail,
  generateUniqueSlug,
  getInfoNested
}
