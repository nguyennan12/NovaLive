import _ from 'lodash'
import slugify from 'slugify'

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
export const getMinPriceFromSkus = (skuList = []) => {
  if (!skuList.length) return 0
  return Math.min(...skuList.map(s => s.sku_price))

}

export const getTotalStockFromSkus = (skuList = []) => {
  if (!skuList.length) return 0
  return skuList.reduce((sum, s) => sum + s.sku_stock, 0)
}

export default {
  getInfo,
  getNameFromEmail,
  generateUniqueSlug,
  getInfoNested
}
