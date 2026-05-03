'use strict'

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  clearMocks: true,
  moduleNameMapper: {
    '^#infrastructure/database/init\\.redis\\.js$': '<rootDir>/tests/mocks/redis.mock.js',
    '^#(.*)$': '<rootDir>/src/$1',
  },
}