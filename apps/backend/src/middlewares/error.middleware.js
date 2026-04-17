import { StatusCodes } from 'http-status-codes'
import MyLogger from '#loggers/MyLogger.js'

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  const message = err.message || 'Internal Server Error'

  const responseTime = req.startTime ? `${Date.now() - req.startTime}ms` : '0ms'
  const logMessage = `${statusCode} - ${responseTime} - ${message}`
  MyLogger.error(logMessage, [
    req.path,
    { requestId: req.requestId },
    { method: req.method }
  ])

  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: message,
    requestId: req.requestId,
    stack: process.env.NODE_ENV === 'dev' ? err.stack : undefined,
  })
}
export default errorMiddleware
