import 'dotenv/config'
import mongoose from 'mongoose'
import mongodbConfig from '#infrastructure/config/mongodb.config.js'
import { seedRBAC } from '#infrastructure/scripts/rbac.seed.js'

const { url, maxPoolSize } = mongodbConfig.db

if (!url) {
  console.error('[Seed] Missing MongoDB URL. Check .env and NODE_ENV.')
  process.exit(1)
}

console.log('[Seed] Connecting to MongoDB...')
await mongoose.connect(url, { maxPoolSize, dbName: 'ecommerce' })
console.log('[Seed] Connected.')

await seedRBAC()

await mongoose.disconnect()
console.log('[Seed] Done. Disconnected.')
process.exit(0)
