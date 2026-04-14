import { getIO } from '#config/socket.config.js'
import { redisClient } from '#database/init.redis.js'
import MyLogger from '#loggers/MyLogger.js'
import { PREFIX } from '#utils/constant.js'

const sendNotificationToUser = (userId, payload) => {
  const io = getIO()
  io.to(userId).emit('ORDER_UPDATE', {
    message: payload.message,
    orderId: payload.orderId,
    newStatus: payload.newStatus,
    timestamp: new Date()
  })
}

const handleLiveEvents = (io, socket) => {
  socket.on('join-live', async (liveCode) => {
    try {
      socket.join(liveCode)
      MyLogger.info(`User ${socket.id} đã join live ${liveCode}`, 'LIVE_SOCKET')

      const currentViewers = await redisClient.incr(`${PREFIX.LIVE_VIEWERS}:${liveCode}`)

      const peakKey = `${PREFIX.LIVE_PEAK_VIEWERS}:${liveCode}`
      const currentPeak = await redisClient.get(peakKey) || 0
      if (currentViewers > currentPeak) {
        await redisClient.set(peakKey, currentViewers)
      }

      io.to(liveCode).emit('UPDATE_VIEWERS', currentViewers)
    } catch (error) {
      MyLogger.error(`Lỗi khi join-live: ${error.message}`, ['LIVE_SOCKET', {}, { err: error }])
    }
  })

  socket.on('send-like', async (liveCode) => {
    try {
      const newTotalLikes = await redisClient.incr(`${PREFIX.LIVE_LIKES}:${liveCode}`)
      io.to(liveCode).emit('UPDATE_LIKES', {
        total: newTotalLikes,
        userId: socket.data.userId,
      })
    } catch (error) {
      MyLogger.error(`Lỗi khi send-like: ${error.message}`, 'LIVE_SOCKET')
    }
  })

  socket.on('leave-live', async (liveCode) => {
    try {
      socket.leave(liveCode)
      MyLogger.info(`User ${socket.id} đã rời live ${liveCode}`, 'LIVE_SOCKET')

      const currentViewers = await redisClient.decr(`${PREFIX.LIVE_VIEWERS}:${liveCode}`)

      const validViewers = currentViewers < 0 ? 0 : currentViewers
      if (currentViewers < 0) {
        await redisClient.set(`${PREFIX.LIVE_VIEWERS}:${liveCode}`, 0)
      }
      io.to(liveCode).emit('UPDATE_VIEWERS', validViewers)
    } catch (error) {
      MyLogger.error(`Lỗi khi leave-live: ${error.message}`, 'LIVE_SOCKET')
    }
  })
}

export default {
  sendNotificationToUser,
  handleLiveEvents
}