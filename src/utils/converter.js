import { Types } from 'mongoose'

const toObjectId = id => new Types.ObjectId(id)

export default {
  toObjectId
}