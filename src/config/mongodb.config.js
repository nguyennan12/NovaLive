import dotenv from 'dotenv'
import { env } from './environment.config.js'

dotenv.config()

// 1. Cấu hình cho môi trường DEV
const dev = {
  app: { port: env.DEV_APP_PORT || 3000 },
  db: {
    url: env.DEV_MONGODB_URI,
    maxPoolSize: parseInt(env.DEV_MONGODB_MAX_POOL_SIZE) || 5
  }
}

// 2. Cấu hình cho môi trường PRO
const pro = {
  app: { port: env.PRO_APP_PORT || 8080 },
  db: {
    url: env.PRO_MONGODB_URI,
    maxPoolSize: parseInt(env.PRO_MONGODB_MAX_POOL_SIZE) || 50
  }
}

const config = { dev, pro }
const node_env = env.NODE_ENV || 'dev'

export default config[node_env]