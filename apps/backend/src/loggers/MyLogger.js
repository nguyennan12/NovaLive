import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'

class MyLogger {
  constructor() {


    const fileFormat = format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        const lvl = level.toUpperCase().padEnd(5)
        const ctx = context ? `[${context}]` : '[GENERAL]'
        const rid = `[ID:${requestId || '---'}]`
        let log = `${timestamp} ${lvl} --- ${ctx} ${rid} : ${message}`
        if (metadata && Object.keys(metadata).length) {
          log += ` | Data: ${JSON.stringify(metadata)}`
        }
        return log
      }
    )

    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.DailyRotateFile({
          dirname: 'src/logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '10m',
          maxFiles: '7d',
          level: 'info',
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            fileFormat
          )
        })
      ]
    })
  }
  commonParams(params = []) {
    let context = 'APP'
    let requestId = 'unknown'
    let metadata = null

    if (params && !Array.isArray(params)) {
      context = params
    } else if (Array.isArray(params)) {
      [context, { requestId } = {}, metadata] = params
    }

    return {
      context,
      requestId: requestId || 'unknown',
      metadata
    }
  }

  info(message, params) {
    const paramLog = this.commonParams(params)
    this.logger.info({ message, ...paramLog })
  }

  error(message, params) {
    const paramLog = this.commonParams(params)
    this.logger.error({ message, ...paramLog })
  }

  warn(message, params) {
    const paramLog = this.commonParams(params)
    this.logger.warn({ message, ...paramLog })
  }

  debug(message, params) {
    const paramLog = this.commonParams(params)
    this.logger.debug({ message, ...paramLog })
  }
}

export default new MyLogger()