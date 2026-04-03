import ac from '#config/rbac.config.js'
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'
import { redisClient } from '#database/init.redis.js'

const grantAcess = (action, resource) => {
  return async (req, res, next) => {
    const userId = req.user?.userId

    if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated')
    try {
      const roleName = (await redisClient.get(`user:role:${userId}`)) || req.user?.role

      const permission = ac.can(roleName)[action](resource)
      if (!permission.granted) throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have enough permission...')
      req.user.role = roleName
      req.rbac_attributes = permission.attributes
      next()
    } catch (error) { next(error) }
  }
}

export default grantAcess