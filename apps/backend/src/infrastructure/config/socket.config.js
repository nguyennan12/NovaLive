import MyLogger from '#infrastructure/loggers/MyLogger.js'
import socketService from '#modules/common/services/socket.service.js'
import { Server } from 'socket.io'

let io

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',// host fe
      methods: ['GET', 'POST']
    }
  })
  io.on('connection', (socket) => {
    MyLogger.info(`A device has connected: ${socket.id}`, 'SOCKET')

    socket.on('join-room', (userId) => {
      socket.join(userId)
      MyLogger.info(`User ${userId} joined their private room`, 'SOCKET')
    })

    socketService.handleLiveEvents(io, socket)

    socket.on('disconnect', () => {
      MyLogger.info(`A device has disconnected: ${socket.id}`, 'SOCKET')
    })
  })

  return io
}

const getIO = () => {
  if (!io) {
    //FOR TEST
    if (process.env.NODE_ENV === 'test') {
      return {
        to: () => ({
          emit: () => { }
        }),
        emit: () => { }
      }
    }
    throw new Error('Socket.io not init. please init!')
  }
  return io
}

export { initSocket, getIO }