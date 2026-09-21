import { createClient } from 'redis'

export const redisClient = process.env.REDIS_URL
  ? createClient({ url: process.env.REDIS_URL })
  : createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined
      },
      password: process.env.REDIS_PASSWORD || undefined
    })

redisClient.on('error', (err) => {
  if (process.env.NODE_ENV !== 'test') console.error('Redis Error:', err)
})
redisClient.on('connect', () => console.log('Redis connected'))

await redisClient.connect()

