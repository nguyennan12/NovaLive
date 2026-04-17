import ApiError from '#core/error.response.js'
import errorMiddleware from '#middlewares/error.middleware.js'
import requestLogger from '#middlewares/log.middleware.js'
import Router from '#routes/v1/index.js'
import cookieParser from 'cookie-parser'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import connectDB from './database/init.mongodb.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './config/swagger-output.json' with { type: 'json' }

const app = express()

await connectDB()

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