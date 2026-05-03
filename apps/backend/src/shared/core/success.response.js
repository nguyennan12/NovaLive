import { StatusCodes, ReasonPhrases } from 'http-status-codes'
class ApiSuccess {
  constructor({ statusCode = StatusCodes.OK, message, reasonStatusCode = ReasonPhrases.OK, metadata = {}
  }) {
    this.message = !message ? reasonStatusCode : message
    this.status = statusCode
    this.metadata = metadata
  }

  send(res) {
    return res.status(this.status).json(this)
  }
}

export default ApiSuccess