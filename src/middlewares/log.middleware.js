import { v4 as uuidv4 } from 'uuid'
import MyLogger from '#loggers/MyLogger.js'

const requestLogger = (req, res, next) => {
  const requestId = req.headers['x-client-id'] || uuidv4()
  req.startTime = Date.now()
  req.requestId = requestId

  const isPostLike = ['POST', 'PUT', 'PATCH'].includes(req.method)
  const params = isPostLike ? req.body : req.query

  MyLogger.info(
    `${req.method} ${req.originalUrl}`,
    ['Request', req, params]
  )

  next()
}

export default requestLogger