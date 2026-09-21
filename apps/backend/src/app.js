import ApiError from '#shared/core/error.response.js'
import errorMiddleware from '#shared/middlewares/error.middleware.js'
import requestLogger from '#shared/middlewares/log.middleware.js'
import Router from '#modules/index.js'
import cookieParser from 'cookie-parser'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import connectDB from './infrastructure/database/init.mongodb.js'
import { initAccessControl } from '#infrastructure/config/rbac.config.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './infrastructure/config/swagger-output.json' with { type: 'json' }

const app = express()

await connectDB()
await initAccessControl()

app.use(cookieParser())
app.use(express.json())

// Enable CORS for cross-domain requests (Vercel Frontend -> Render Backend)
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-id, x-api-key')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(requestLogger)
app.use('/', Router)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, 'Not Found'))
})

app.use(errorMiddleware)

export default app