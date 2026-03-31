import { StatusCodes } from 'http-status-codes'

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: message,
    stack: process.env.NODE_ENV === 'dev' ? err.stack : undefined,
  })
}
export default errorMiddleware
