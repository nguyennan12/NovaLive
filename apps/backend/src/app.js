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

app.use(requestLogger)
app.use('/', Router)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, 'Not Found'))
})

app.use(errorMiddleware)

export default app