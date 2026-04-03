import ac from '#config/rbac.config.js'
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'
import { redisClient } from '#database/init.redis.js'

const grantAcess = (actions, resource) => {
  return async (req, res, next) => {
    const userId = req.user?.userId

    if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated')
    try {
      const roleName = (await redisClient.get(`user:role:${userId}`)) || req.user?.role
      //action có thể thêm nhiều nếu có nhiều role có quyền truy cập -> tạo list array
      const actionList = Array.isArray(actions) ? actions : [actions]
      let permission = null
      //kiểm tra xem có permisson ko
      const hasPermission = actionList.some(action => {
        if (typeof ac.can(roleName)[action] === 'function') {
          const p = ac.can(roleName)[action](resource)
          if (p.granted) {
            permission = p
            return true
          }
        }
        return false
      })

      if (!hasPermission) throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have enough permission...')
      req.user.role = roleName
      req.rbac_attributes = permission.attributes
      next()
    } catch (error) { next(error) }
  }
}

export default grantAcess