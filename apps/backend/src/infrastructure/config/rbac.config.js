import { redisClient } from '#infrastructure/database/init.redis.js'
import rbacService from '#modules/rbac/services/rbac.service.js'
import { AccessControl } from 'accesscontrol'

let ac = new AccessControl()

const refreshGrants = async () => {
  const listGrants = await rbacService.getListRole({ limit: 1000, offset: 0 })
  const grantsObject = listGrants.reduce((acc, grant) => {
    const { role, resource, action, attributes, parent } = grant
    if (!acc[role]) acc[role] = {}
    if (parent) {
      acc[role].$extend = [parent]
    }
    if (!acc[role][resource]) acc[role][resource] = {}
    acc[role][resource][action] = attributes.split(',').map(a => a.trim())
    return acc
  }, {})

  await redisClient.set('RBAC_GRANTS', JSON.stringify(grantsObject))
  ac.setGrants(grantsObject)
  return grantsObject
}

export const initAccessControl = async () => {
  let grants = await redisClient.get('RBAC_GRANTS')

  if (!grants) {
    const grantsObject = await refreshGrants()

    // DB chưa được seed, tự động seed roles mặc định (scripts)
    if (Object.keys(grantsObject).length === 0) {
      console.log('[RBAC] No roles found in DB, running auto-seed...')
      const { seedRBAC } = await import('#infrastructure/scripts/rbac.seed.js')
      await seedRBAC()
      await refreshGrants()
    }
  } else {
    const parsed = JSON.parse(grants)
    // Redis có nhưng rỗng, xóa và seed lại
    if (Object.keys(parsed).length === 0) {
      await redisClient.del('RBAC_GRANTS')
      console.log('[RBAC] Stale empty grants in Redis, re-seeding...')
      const { seedRBAC } = await import('#infrastructure/scripts/rbac.seed.js')
      await seedRBAC()
      await refreshGrants()
    } else {
      ac.setGrants(parsed)
    }
  }

  const subscriber = redisClient.duplicate()
  await subscriber.connect()
  await subscriber.subscribe('RBAC_CHANEL', async (message) => {
    if (message === 'UPDATE_GRANTS') {
      const latestGrants = await redisClient.get('RBAC_GRANTS')
      ac.setGrants(JSON.parse(latestGrants))
    }
  })
}

export default ac