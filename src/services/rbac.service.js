import ApiError from '#core/error.response.js'
import resourceModel from '#models/resource.model.js'
import roleModel from '#models/role.model.js'
import { StatusCodes } from 'http-status-codes'

const createResource = async ({ name, description }) => {
  return await resourceModel.create({ src_name: name, src_description: description })
}

const getListResource = async ({ limit = 30, offset = 0 }) => {
  return await resourceModel.find({}).limit(limit).skip(offset).lean()
}

const createRole = async ({ name, description, grants }) => {
  const foundRole = await roleModel.findOne({ role_name: name })
  if (foundRole) throw new ApiError(StatusCodes.BAD_REQUEST, 'Role already exists!')
  await redisClient.del('RBAC_GRANTS')
  return await roleModel.create({ role_name: name, role_description: description, role_grants: grants })
}

const getListRole = async ({ limit = 30, offset = 0 }) => {
  return await roleModel.aggregate([
    { $unwind: '$role_grants' },
    {
      $lookup: {
        from: 'Resources',
        localField: 'role_grants.resourceId',
        foreignField: '_id',
        as: 'resource'
      }
    },
    { $unwind: '$resource' },
    {
      $project: {
        role: '$role_name',
        resource: '$resource.src_name',
        action: '$role_grants.actions',
        attributes: '$role_grants.attributes'
      }
    },
    { $unwind: '$action' },
    {
      $project: { _id: 0, role: 1, resource: 1, acction: '$action', attributes: 1 }
    },
    { $skip: offset },
    { $limit: limit }
  ])
}


export default {
  createResource,
  getListResource,
  createRole,
  getListRole
}
