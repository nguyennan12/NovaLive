import { createRealApp } from '../helpers/appFactory.js'
import { http } from '../helpers/http.js'
import { signup, login, authHeaders, activateUser } from '../helpers/auth.js'
import { skuModel } from '#models/sku.model.js'
import livestreamModel from '#models/livestream.model.js'

let app
let token, userId, shopId, productId, sku, liveId

beforeAll(async () => {
  app = await createRealApp()
})

const TEST_PASSWORD = 'abc12345'
const STREAMER_EMAIL = 'streamer@test.com'

describe('Livestream Flow (Split steps)', () => {

  test('Step 1: Setup Streamer & Shop & Product', async () => {
    // Admin login (global admin)
    const adminLogin = await login(app, { email: 'admin@test.com', password: 'Admin12345' })
    const adminToken = adminLogin.token
    const adminId = adminLogin.userId

    // Streamer setup
    await signup(app, { email: STREAMER_EMAIL, password: TEST_PASSWORD, name: 'Streamer' })
    await activateUser(STREAMER_EMAIL)
    const initialLogin = await login(app, { email: STREAMER_EMAIL, password: TEST_PASSWORD })

    const shopRes = await http(app)
      .post('/v1/api/shop/register')
      .set(authHeaders({ token: initialLogin.token, userId: initialLogin.userId }))
      .send({
        name: 'Stream Shop',
        address: {
          street: 'Live St', ward: 'W1', district: 'D1', province: 'P1',
          province_id: 1, district_id: 1, ward_code: '1'
        },
        contact: '0999999999'
      })
    shopId = shopRes.body.metadata.id || shopRes.body.metadata._id

    // Relogin to get shopId in JWT
    const relogin = await login(app, { email: STREAMER_EMAIL, password: TEST_PASSWORD })
    token = relogin.token
    userId = relogin.userId

    // Product setup
    const attrRes = await http(app)
      .post('/v1/api/attribute')
      .set(authHeaders({ token: adminToken, userId: adminId }))
      .send({ attr_name: 'Size', attr_type: 'text', attr_id: 'size_attr' })
    const attributeId = attrRes.body.metadata.attr_id

    const catRes = await http(app)
      .post('/v1/api/category')
      .set(authHeaders({ token: adminToken, userId: adminId }))
      .send({ name: 'Live Category' })
    const categoryId = catRes.body.metadata.cat_id
    const categorySlug = catRes.body.metadata.cat_slug

    await http(app)
      .post(`/v1/api/category/${categoryId}/attribute`)
      .set(authHeaders({ token: adminToken, userId: adminId }))
      .send({ attributeId, isRequired: true, displayOrder: 1 })

    const prodRes = await http(app)
      .post('/v1/api/product/')
      .set(authHeaders({ token, userId }))
      .send({
        spu_name: 'Stream Product',
        spu_thumb: 'thumb_url',
        spu_description: 'Test product for stream',
        spu_price: 50000,
        spu_quantity: 10,
        spu_shopId: shopId.toString(),
        spu_category: [categorySlug],
        spu_attributes: [{ attr_id: attributeId, attr_value: 'XL' }],
        isPublished: true
      })
    if (prodRes.status !== 201) console.error('Prod Live Fail:', prodRes.body)
    expect(prodRes.status).toBe(201)
    productId = prodRes.body.metadata._id
    sku = await skuModel.findOne({ sku_spuId: productId })
  })

  test('Step 2: Create Live & Add Product', async () => {
    const liveRes = await http(app)
      .post('/v1/api/livestream')
      .set(authHeaders({ token, userId }))
      .send({
        title: 'Tech Unboxing Live',
        description: 'Unboxing latest gadgets',
        scheduledAt: new Date(Date.now() + 3600000)
      })
    expect(liveRes.status).toBe(200)
    liveId = liveRes.body.metadata._id

    const addProdRes = await http(app)
      .post(`/v1/api/livestream/${liveId}/product`)
      .set(authHeaders({ token, userId }))
      .send([{
        spu_id: productId.toString(),
        skus: [{ sku_id: sku._id.toString(), live_price: 45000 }]
      }])
    expect(addProdRes.status).toBe(200)
  })

  test('Step 3: Start Live & Pin Product & End Live', async () => {
    // Start
    await http(app).post(`/v1/api/livestream/${liveId}/start`).set(authHeaders({ token, userId }))
    const liveInDb = await livestreamModel.findById(liveId)
    expect(liveInDb.live_status).toBe('live')

    // Pin
    const pinRes = await http(app)
      .patch(`/v1/api/livestream/${liveId}/pin`)
      .set(authHeaders({ token, userId }))
      .send({ productId: productId.toString() })
    expect(pinRes.status).toBe(200)
    expect(pinRes.body.metadata.is_featured).toBe(true)

    // End
    const endRes = await http(app).post(`/v1/api/livestream/${liveId}/end`).set(authHeaders({ token, userId }))
    expect(endRes.status).toBe(200)
    expect(endRes.body.metadata.live_status).toBe('ended')
  })
})
