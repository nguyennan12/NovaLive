import { redisClient } from '#database/init.redis.js'
import userRepo from '#models/repository/user.repo.js'
import { REFRESHTOKEN_LIFE, ROLES } from '#utils/constant.js'
import tokenService from './token.service.js'

const changeRoleAdmin = async ({ userId }) => {
  await userRepo.changeRole({ userId, role: ROLES.ADMIN })
  await redisClient.set(`user:role:${userId}`, ROLES.ADMIN, { EX: REFRESHTOKEN_LIFE })
  await tokenService.deleteKeyStoreById(userId)
}

const changeRoleShop = async ({ userId }) => {
  await userRepo.changeRole({ userId, role: ROLES.SHOP })
  await redisClient.set(`user:role:${userId}`, ROLES.SHOP, { EX: REFRESHTOKEN_LIFE })
  await tokenService.deleteKeyStoreById(userId)
}

export default {
  changeRoleAdmin,
  changeRoleShop
}