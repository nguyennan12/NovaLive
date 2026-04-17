import { redisClient } from '#database/init.redis.js'
import userRepo from '#models/repository/user.repo.js'
import { REFRESHTOKEN_LIFE, ROLES } from '#utils/constant.js'
import tokenService from './token.service.js'
import { PREFIX } from '#utils/constant.js'

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