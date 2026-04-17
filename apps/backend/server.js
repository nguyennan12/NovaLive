import app from './src/app.js'
import { env } from '#config/environment.config.js'
import { initSocket } from '#config/socket.config.js'

const server = app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`Hello ${env.AUTHOR}, I am running at  http://${env.HOST}:${env.PORT}`)
})

initSocket(server)

process.on('SIGINT', () => {
  console.log('Shutting down server...')
  server.close(() => {
    console.log('Server stopped')
    process.exit(0)
  })
})