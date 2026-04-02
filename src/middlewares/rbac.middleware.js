import ac from '#config/rbac.config.js'
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'

const grantAcess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const roleName = req.user?.role
      if (!roleName) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Role invalid')
      const permission = ac.can(roleName)[action](resource)
      if (!permission.granted) throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have enough permission...')
      req.rbac_attributes = permission.attributes
      next()
    } catch (error) { next(error) }
  }
}

export default grantAcess