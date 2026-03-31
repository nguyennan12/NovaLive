import express from 'express'
import connectDB from './database/init.mongodb.js'
import Router from '#routes/v1/index.js'
import errorMiddleware from '#middlewares/error.middleware.js'
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'

const app = express()

await connectDB()

app.use(express.json())

app.use('/', Router)

app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, 'Not Found'))
})

app.use(errorMiddleware)

export default app