import { redisClient } from '#infrastructure/database/init.redis.js'
import userRepo from '#modules/auth/repos/user.repo.js'
import { REFRESHTOKEN_LIFE, ROLES } from '#shared/utils/constant.js'
import tokenService from '#modules/auth/services/token.service.js'
import { PREFIX } from '#shared/utils/constant.js'

const changeRoleAdmin = async ({ userId }) => {
  await userRepo.changeRole({ userId, role: ROLES.ADMIN })
  await redisClient.set(`${PREFIX.USER_RULE}:${userId}`, ROLES.ADMIN, { EX: REFRESHTOKEN_LIFE / 1000 })
  await tokenService.deleteKeyStoreById(userId)
}

const changeRoleShop = async ({ userId, shopId }) => {
  await userRepo.changeRole({ userId, role: ROLES.SHOP, shopId })
  await redisClient.set(`${PREFIX.USER_RULE}:${userId}`, ROLES.SHOP, { EX: REFRESHTOKEN_LIFE / 1000 })
  await tokenService.deleteKeyStoreById(userId)
}

export default {
  changeRoleAdmin,
  changeRoleShop
}