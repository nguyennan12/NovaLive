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
      console.log(`User ${userId} joined their private room`)
    })

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