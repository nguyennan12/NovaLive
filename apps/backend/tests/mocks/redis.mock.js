import { jest } from '@jest/globals'

export const redisClient = {
  get: jest.fn(async () => null),
  set: jest.fn(async () => 'OK'),
  setEx: jest.fn(async () => 'OK'),
  del: jest.fn(async () => 1),
  exists: jest.fn(async () => 0),
  eval: jest.fn(async () => 1),
  incrBy: jest.fn(async () => 1),
  decrBy: jest.fn(async () => 1),
  mGet: jest.fn(async () => []),
  mSet: jest.fn(async () => 'OK'),
  hSet: jest.fn(async () => 1),
  hGet: jest.fn(async () => null),
  hGetAll: jest.fn(async () => ({})),
  expire: jest.fn(async () => 1),
  multi: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    del: jest.fn().mockReturnThis(),
    exec: jest.fn(async () => []),
  })),
  duplicate: jest.fn(() => ({
    connect: jest.fn(async () => { }),
    subscribe: jest.fn(async () => { }),
    on: jest.fn(() => { }),
  })),
  publish: jest.fn(async () => 1),
  connect: jest.fn(async () => { }),
  quit: jest.fn(async () => { }),
  on: jest.fn(() => { }),
}
