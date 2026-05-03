import { createRealApp } from '../helpers/appFactory.js'
import { http } from '../helpers/http.js'
import { signup, login, authHeaders, activateUser } from '../helpers/auth.js'
import OtpModel from '#modules/auth/models/otp.model.js'

let app
const TEST_PASSWORD = 'abc12345'

beforeAll(async () => {
  app = await createRealApp()
})

describe('Authentication (Integration)', () => {
  // TEST SIGN UP (SUCCESS & EAMIL ALREADY)
  describe('POST /v1/api/access/signup', () => {
    const email = 'newuser@test.com'
    test('Should signup successfully', async () => {
      const res = await http(app)
        .post('/v1/api/access/signup')
        .send({ email, password: TEST_PASSWORD, name: 'New User' })

      expect(res.status).toBe(201)
      expect(res.body.metadata).toHaveProperty('user')
      expect(res.body.metadata).toHaveProperty('tokens')
    })
    test('Should fail if email already exists', async () => {
      const res = await http(app)
        .post('/v1/api/access/signup')
        .send({ email, password: TEST_PASSWORD, name: 'Another Name' })

      expect(res.status).toBe(400)
      expect(res.body.message).toContain('exists')
    })
  })
  //TEST VERIFY OTP
  describe('POST /v1/api/access/verify', () => {
    const email = 'verify@test.com'

    test('Should verify account successfully with correct OTP', async () => {
      await signup(app, { email, password: TEST_PASSWORD, name: 'Verify Me' })
      const otpDoc = await OtpModel.findOne({ otp_email: email }).sort({ createdAt: -1 })

      const res = await http(app)
        .post('/v1/api/access/verify')
        .send({ email, otpToken: otpDoc.otp_token })

      expect(res.status).toBe(201)
      expect(res.body.metadata.user.user_status).toBe('active')
    })

    test('Should fail with incorrect OTP', async () => {
      const res = await http(app)
        .post('/v1/api/access/verify')
        .send({ email: 'verify_fail@test.com', otpToken: '999999' })

      expect(res.status).toBe(400)
    })
  })

  describe('POST /v1/api/access/login', () => {
    test('Should fail if account is not active', async () => {
      const email = 'login_pending@test.com'
      await signup(app, { email, password: TEST_PASSWORD, name: 'Pending User' })
      const res = await http(app)
        .post('/v1/api/access/login')
        .send({ email, password: TEST_PASSWORD })

      expect(res.status).toBe(400)
      expect(res.body.message).toContain('Account not found')
    })

    test('Should login successfully after activation', async () => {
      const email = 'login_success@test.com'
      await signup(app, { email, password: TEST_PASSWORD, name: 'Success User' })
      await activateUser(email)
      const res = await http(app)
        .post('/v1/api/access/login')
        .send({ email, password: TEST_PASSWORD })

      expect(res.status).toBe(201)
      expect(res.body.metadata.tokens).toHaveProperty('accessToken')
      expect(res.header['set-cookie']).toBeDefined()
    })

    test('Should fail with wrong password (valid format)', async () => {
      const email = 'login_wrong_pass@test.com'
      await signup(app, { email, password: TEST_PASSWORD, name: 'Wrong Pass User' })
      await activateUser(email)
      const res = await http(app)
        .post('/v1/api/access/login')
        .send({ email, password: 'WrongPass123' }) // Valid format but incorrect

      expect(res.status).toBe(401)
    })
  })

  describe('POST /v1/api/access/logout', () => {
    test('Should logout successfully with auth', async () => {
      const email = 'logout_user@test.com'
      await signup(app, { email, password: TEST_PASSWORD, name: 'Logout User' })
      await activateUser(email)
      const { token, userId } = await login(app, { email, password: TEST_PASSWORD })

      const res = await http(app)
        .post('/v1/api/access/logout')
        .set(authHeaders({ token, userId }))
        .send({})

      expect(res.status).toBe(201)
    })
  })

  describe('POST /v1/api/access/refreshtoken', () => {
    test('Should refresh token successfully', async () => {
      const email = 'refresh_user@test.com'
      await signup(app, { email, password: TEST_PASSWORD, name: 'Refresh User' })
      await activateUser(email)

      const loginRes = await http(app)
        .post('/v1/api/access/login')
        .send({ email, password: TEST_PASSWORD })

      const { accessToken } = loginRes.body.metadata.tokens
      const userId = loginRes.body.metadata.user._id
      const cookies = loginRes.header['set-cookie']
      const refreshToken = cookies[0].split(';')[0].split('=')[1]

      const res = await http(app)
        .post('/v1/api/access/refreshtoken')
        .set('Cookie', [`refreshToken=${refreshToken}`])
        .set({ 'x-client-id': userId, 'authorization': accessToken })
        .send({})

      expect(res.status).toBe(201)
      expect(res.body.metadata.tokens).toHaveProperty('accessToken')
    })
  })
})