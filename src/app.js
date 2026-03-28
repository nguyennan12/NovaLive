import express from 'express'
import connectDB from './database/init.mongodb.js'
import Router from '#routes/index.js'
import errorMiddleware from '#middlewares/error.middieware.js'

const app = express()

await connectDB()

app.use(express.json())

app.use('/', Router)

app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, 'Not Found'))
})

app.use(errorMiddleware)

export default app