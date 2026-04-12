import { getIO } from '#config/socket.config.js'

const sendNotificationToUser = (userId, payload) => {
  const io = getIO()
  io.to(userId).emit('ORDER_UPDATE', {
    message: payload.message,
    orderId: payload.orderId,
    newStatus: payload.newStatus,
    timestamp: new Date()
  })
}

export default {
  sendNotificationToUser
}