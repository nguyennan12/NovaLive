import app from './src/app.js'
import { env } from '#config/environment.config.js'

const server = app.listen(env.PORT, env.HOST, () => {
  console.log(`Hello ${env.AUTHOR}, I am running at  http://${env.HOST}:${env.PORT}`)
})


process.on('SIGINT', () => {
  console.log('Shutting down server...')
  server.close(() => {
    console.log('Server stopped')
    process.exit(0)
  })
})