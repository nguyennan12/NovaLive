import { Types } from 'mongoose'
import slugify from 'slugify'

const toObjectId = id => new Types.ObjectId(id)

const toSlug = (name) => slugify(name, { lower: true, strict: true })

function toFullAdress({ street, ward, district, province }) {
  return [street, ward, district, province]
    .filter(Boolean)
    .map(s => s.trim())
}

export default {
  toObjectId,
  toSlug,
  toFullAdress
}