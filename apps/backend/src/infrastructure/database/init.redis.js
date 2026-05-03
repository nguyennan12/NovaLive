import { createClient } from 'redis'

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: {}
  }
})

redisClient.on('error', (err) => {
  if (process.env.NODE_ENV !== 'test') console.error('Redis Error:', err)
})
redisClient.on('connect', () => console.log('Redis connected'))

await redisClient.connect()

