import ac from '#config/rbac.config.js'
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'
import { redisClient } from '#database/init.redis.js'
import { PREFIX } from '#utils/constant.js'

const grantAccess = (actions, resource) => {
  return async (req, res, next) => {
    const userId = req.user?.userId

    if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated')
    try {
      const roleName = (await redisClient.get(`${PREFIX.USER_RULE}:${userId}`)) || req.user?.role
      //action có thể thêm nhiều nếu có nhiều role có quyền truy cập -> tạo list array
      const actionList = Array.isArray(actions) ? actions : [actions]
      let permission = null
      const hasPermission = actionList.some(action => {
        // Convert create:any -> createAny or use directly
        const methodName = action.includes(':') 
          ? action.split(':').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('')
          : action

        if (ac.can(roleName) && typeof ac.can(roleName)[methodName] === 'function') {
          const p = ac.can(roleName)[methodName](resource)
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

export default grantAccess