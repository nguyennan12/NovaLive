import { Types } from 'mongoose'
import slugify from 'slugify'

const toObjectId = id => new Types.ObjectId(id)

const toSlug = (name) => slugify(name, { lower: true, strict: true })

export default {
  toObjectId,
  toSlug
}