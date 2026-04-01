import express from 'express'
import connectDB from './database/init.mongodb.js'
import Router from '#routes/v1/index.js'
import errorMiddleware from '#middlewares/error.middleware.js'
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'
import cookieParser from 'cookie-parser'
import requestLogger from '#middlewares/log.middleware.js'

const app = express()

await connectDB()

app.use(cookieParser())
app.use(express.json())

app.use(requestLogger)
app.use('/', Router)

app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, 'Not Found'))
})

app.use(errorMiddleware)

export default app