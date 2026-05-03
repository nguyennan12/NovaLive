import ApiError from '#shared/core/error.response.js'
import resourceModel from '#modules/rbac/models/resource.model.js'
import roleModel from '#modules/rbac/models/role.model.js'
import { StatusCodes } from 'http-status-codes'
import { redisClient } from '#infrastructure/database/init.redis.js'
import { initAccessControl } from '#infrastructure/config/rbac.config.js'
import { mergeGrants } from '#shared/helpers/object.helper.js'


const createResource = async ({ name, description }) => {
  return await resourceModel.findOneAndUpdate(
    { src_name: name },
    { src_name: name, src_description: description },
    { upsert: true, returnDocument: 'after' }
  )
}

const getListResource = async ({ limit = 30, offset = 0 }) => {
  return await resourceModel.find({}).limit(limit).skip(offset).lean()
}

const createRole = async ({ name, description, grants, parent }) => {
  const result = await roleModel.findOneAndUpdate(
    { role_name: name },
    { role_name: name, role_description: description, role_grants: grants, role_parent: parent },
    { upsert: true, returnDocument: 'after' }
  )
  //gọi đến channel update grants và update tât cả
  await redisClient.del('RBAC_GRANTS')
  await initAccessControl()
  await redisClient.publish('RBAC_CHANEL', 'UPDATE_GRANTS')

  return result
}

const addGrantstoRole = async ({ name, grants }) => {
  const role = await roleModel.findOne({ role_name: name })
  if (!role) throw new Error('Role not found')

  role.role_grants = mergeGrants(role.role_grants, grants)
  await role.save()

  await redisClient.del('RBAC_GRANTS')
  await initAccessControl()
  await redisClient.publish('RBAC_CHANEL', 'UPDATE_GRANTS')

  return role
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
        parent: '$role_parent',
        resource: '$resource.src_name',
        action: '$role_grants.actions',
        attributes: '$role_grants.attributes'
      }
    },
    { $unwind: '$action' },
    {
      $project: { _id: 0, role: 1, parent: 1, resource: 1, action: '$action', attributes: 1 }
    },
    { $skip: offset },
    { $limit: limit }
  ])
}


export default {
  createResource,
  getListResource,
  createRole,
  getListRole,
  addGrantstoRole
}
