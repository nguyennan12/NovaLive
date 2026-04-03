import { redisClient } from '#database/init.redis.js'
import rbacService from '#services/rbac.service.js'
import { AccessControl } from 'accesscontrol'

let ac = new AccessControl()

const refreshGrants = async () => {
  const grants = await rbacService.getListRole()
  await redisClient.set('RBAC_GRANTS', JSON.stringify(grants))
  ac.setGrants(grants)
}

const initAccessControl = async () => {
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