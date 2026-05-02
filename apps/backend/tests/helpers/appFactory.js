import { jest } from '@jest/globals'

export async function createRealApp() {
  // jest.resetModules() // Removed to avoid multiple mongoose instances between test helpers and app


  // Mongo config vẫn mock bằng alias được, nhưng để chắc ăn ta cũng dùng relative:
  jest.unstable_mockModule('../../src/config/mongodb.config.js', () => ({
    default: { db: { url: globalThis.__MONGO_URI__, maxPoolSize: 10 } },
  }))

  // Redis: handled via moduleNameMapper in jest.config.cjs → tests/mocks/redis.mock.js

  // RabbitMQ service: ../../src/database/init.rabbitMQ.js
  jest.unstable_mockModule('../../src/database/init.rabbitMQ.js', () => ({
    RabbitMQClient: {
      connectRabbitMQ: jest.fn(async () => { }),
      publishMessage: jest.fn(async () => { }),
      setupDelayQueue: jest.fn(async () => { }),
      sendOrderToDelayQueue: jest.fn(async () => { }),
    },
  }))

  // Nodemailer: ../../src/config/nodemailer.config.js
  jest.unstable_mockModule('../../src/config/nodemailer.config.js', () => ({
    default: {
      sendMail: jest.fn(async () => ({ messageId: 'mock' })),
      verify: jest.fn((cb) => cb?.(null, true)),
    },
  }))

  // Elastic: ../../src/database/init.elasticsearch.js
  jest.unstable_mockModule('../../src/database/init.elasticsearch.js', () => ({
    ElasticClient: {
      info: jest.fn(async () => ({})),
      search: jest.fn(async () => ({ hits: { hits: [] } })),
      index: jest.fn(async () => ({})),
    },
  }))

  const mod = await import('../../src/app.js')
  const app = mod.default

  // Seed RBAC for testing environment
  const { seedRBAC } = await import('./rbacSeed.js')
  const { initAccessControl } = await import('../../src/config/rbac.config.js')
  await seedRBAC()
  await initAccessControl()

  return app
}