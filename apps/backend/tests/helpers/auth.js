import { http } from './http.js'
import userRepo from '../../src/modules/auth/repos/user.repo.js'


function pick(obj, paths) {
  for (const p of paths) {
    const parts = p.split('.')
    let cur = obj
    let ok = true
    for (const part of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, part)) cur = cur[part]
      else {
        ok = false
        break
      }
    }
    if (ok && cur) return cur
  }
  return null
}

export async function signup(app, body) {
  const res = await http(app).post('/v1/api/access/signup').send(body)
  return res
}

export async function login(app, body) {
  const res = await http(app).post('/v1/api/access/login').send(body)

  const token =
    pick(res.body, [
      'metadata.tokens.accessToken',
      'metadata.accessToken',
      'data.tokens.accessToken',
      'data.accessToken',
      'accessToken',
      'token',
    ]) || null

  const userId =
    pick(res.body, [
      'metadata.user.userId',
      'metadata.user._id',
      'data.user.userId',
      'data.user._id',
      'metadata.userId',
      'data.userId',
      'userId',
      '_id',
    ]) || null

  return { res, token, userId }
}

export function authHeaders({ token, userId }) {
  return {
    'x-client-id': `${userId}`,
    authorization: `Bearer ${token}`,
  }
}

export async function activateUser(email) {
  await userRepo.changeStatus({ email, status: 'active' })
}

