import { redisClient } from '#database/init.redis.js'
import rbacService from '#services/rbac.service.js'
import { AccessControl } from 'accesscontrol'

let ac = new AccessControl()

const refreshGrants = async () => {
  const listGrants = await rbacService.getListRole({ limit: 100, offset: 0 })
  const grantsObject = listGrants.reduce((acc, grant) => {
    const { role, resource, action, attributes, parent } = grant
    //lần đầu khởi tạo rỗng
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
}

export const initAccessControl = async () => {
  let grants = await redisClient.get('RBAC_GRANTS')
  if (!grants) {
    await refreshGrants()
  } else {
    ac.setGrants(grants)
  }

  //khi admin update 1 role
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