import socketService from '#services/socket.service.js'
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
    console.log('A device has connected:', socket.id)

    socket.on('join-room', (userId) => {
      socket.join(userId)
      MyLogger.info(`User ${userId} joined their private room`, 'SOCKET')
    })

    socketService.handleLiveEvents(io, socket)

    socket.on('disconnect', () => {
      console.log('A device has disconnected')
    })
  })

  return io
}

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not init. please init!')
  }
  return io
}

export { initSocket, getIO }