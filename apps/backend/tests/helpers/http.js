import request from 'supertest'

export function http(app) {
  return request(app)
}