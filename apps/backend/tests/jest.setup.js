import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongo

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  process.env.VNP_HASH_SECRET = 'secret' // Add default secret for payment tests
  process.env.VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
  process.env.VNP_TMN_CODE = 'ABCDEFGH'
  process.env.VNP_RETURN_URL = 'http://localhost:3000/vnpay-return'
  process.env.GHN_API_URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2'
  process.env.GHN_API_TOKEN = 'dummy_token'
  process.env.GHN_SHOP_ID = '123'
  process.env.AGORA_APP_ID = '00000000000000000000000000000000'
  process.env.AGORA_APP_CERTIFICATE = '00000000000000000000000000000000'
  mongo = await MongoMemoryServer.create()
  globalThis.__MONGO_URI__ = mongo.getUri()
})

afterAll(async () => {
  try {
    if (mongoose.connection?.readyState === 1 && mongoose.connection?.db) {
      const cols = await mongoose.connection.db.collections()
      for (const c of cols) await c.deleteMany({})
    }
    if (mongoose.connection?.readyState) {
      await mongoose.disconnect()
    }
  } finally {
    if (mongo) await mongo.stop()
  }
})