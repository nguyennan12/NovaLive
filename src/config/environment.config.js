import 'dotenv/config'

export const env = {
  DEV_MONGODB_URI: process.env.DEV_MONGODB_URI,
  DEV_MONGODB_MAX_POOL_SIZE: process.env.DEV_MONGODB_MAX_POOL_SIZE,
  PRO_MONGODB_URI: process.env.PRO_MONGODB_URI,
  PRO_MONGODB_MAX_POOL_SIZE: process.env.PRO_MONGODB_MAX_POOL_SIZE,

  AUTHOR: process.env.AUTHOR,
  PORT: process.env.PORT,
  HOST: process.env.HOST,

  NODE_ENV: process.env.NODE_ENV
}