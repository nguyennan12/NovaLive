import { createRealApp } from '../helpers/appFactory.js'
import { http } from '../helpers/http.js'
import { signup, login, authHeaders, activateUser } from '../helpers/auth.js'
import rbacService from '#modules/rbac/services/rbac.service.js'
import { initAccessControl } from '#infrastructure/config/rbac.config.js'

let app

beforeAll(async () => {
  app = await createRealApp()

  // Seed Roles and Resources for Test
  const productRes = await rbacService.createResource({ name: 'PRODUCT', description: 'Product' })
  const rbacRes = await rbacService.createResource({ name: 'RBAC', description: 'RBAC' })

  // Create a Category and Attribute for product creation test
  const categoryModel = (await import('#modules/category/models/category.model.js')).default
  const attributeModel = (await import('#modules/category/models/attribute.model.js')).default

  const attr = await attributeModel.create({
    attr_name: 'Manufacturer',
    attr_id: 'attr_manufacturer',
    attr_type: 'text'
  })

  const cat = await categoryModel.create({
    cat_name: 'Electronic',
    cat_id: 'cat_electronic',
    cat_parentId: null,
    cat_attributes: [
      { attr_id: 'attr_manufacturer', isRequired: true }
    ]
  })
  global.testCategoryId = cat._id.toString()
  global.testAttrId = attr.attr_id

  await rbacService.createRole({
    name: 'admin',
    grants: [
      { resourceId: productRes._id, actions: ['read:any', 'create:any', 'update:any', 'delete:any'], attributes: '*' },
      { resourceId: rbacRes._id, actions: ['read:any', 'create:any', 'update:any', 'delete:any'], attributes: '*' }
    ]
  })
  await rbacService.createRole({
    name: 'user',
    grants: [
      { resourceId: productRes._id, actions: ['read:any'], attributes: '*' }
    ]
  })

  await rbacService.createRole({
    name: 'shop',
    grants: [
      { resourceId: productRes._id, actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' }
    ]
  })

  // Seed Admin User
  const bcrypt = await import('bcrypt')
  const password = await bcrypt.default.hash('Admin12345', 10)
  const { UserModel } = await import('#modules/auth/models/user.model.js')
  await UserModel.create({
    user_email: 'admin@test.com',
    user_password: password,
    user_name: 'System Admin',
    user_slug: 'system-admin',
    user_role: 'admin',
    user_status: 'active'
  })

  // IMPORTANT: Reload RBAC grants after seeding
  await initAccessControl()
})

const TEST_PASSWORD = 'abc12345'

describe('RBAC (smoke integration)', () => {
  test('POST /v1/api/rbac/resource/ - non-admin should be forbidden (403) or unauthorized', async () => {
    const email = 'userRBAC@test.com'
    await signup(app, { email, password: TEST_PASSWORD, name: 'UserRBAC' })
    await activateUser(email)
    const { token, userId } = await login(app, { email, password: TEST_PASSWORD })

    const res = await http(app)
      .post('/v1/api/rbac/resource/')
      .set(authHeaders({ token, userId }))
      .send({ name: 'PRODUCT', description: 'product resource' })

    expect([401, 403]).toContain(res.status)
  })

  test('GET /v1/api/rbac/role/ - authenticated should return 200 (or 403 if restricted)', async () => {
    const email = 'userRBAC2@test.com'
    await signup(app, { email, password: TEST_PASSWORD, name: 'UserRBAC2' })
    await activateUser(email)
    const { token, userId } = await login(app, { email, password: TEST_PASSWORD })

    const res = await http(app)
      .get('/v1/api/rbac/role/')
      .set(authHeaders({ token, userId }))

    expect([200, 401, 403]).toContain(res.status)
    if (res.status === 200) {
      expect(res.body).toHaveProperty('metadata')
    }
  })

  test('POST /v1/api/rbac/resource/ - admin should be able to create resource', async () => {
    // We assume admin@test.com / Admin12345 exists from seed
    const { token, userId } = await login(app, { email: 'admin@test.com', password: 'Admin12345' })

    const res = await http(app)
      .post('/v1/api/rbac/resource/')
      .set(authHeaders({ token, userId }))
      .send({ name: 'TEST_RESOURCE', description: 'test resource' })

    if (res.status !== 201) console.error('Admin RBAC Fail:', res.body)
    expect(res.status).toBe(201)
    expect(res.body.metadata.src_name).toBe('TEST_RESOURCE')
  })

  describe('Product RBAC Flow', () => {
    test('User should be able to read products but NOT create them', async () => {
      const email = 'user_read@test.com'
      await signup(app, { email, password: TEST_PASSWORD, name: 'User Read' })
      await activateUser(email)
      const { token, userId } = await login(app, { email, password: TEST_PASSWORD })

      // Read - Should pass (GET /v1/api/product/)
      const readRes = await http(app)
        .get('/v1/api/product/')
        .send()
      expect(readRes.status).toBe(200)

      // Create - Should fail (POST /v1/api/product/)
      const createRes = await http(app)
        .post('/v1/api/product/')
        .set(authHeaders({ token, userId }))
        .send({ product_name: 'Fake Product', product_thumb: 'test.jpg', product_price: 100, product_type: 'Electronic', product_attributes: { manufacturer: 'test', model: 'test' } })

      expect(createRes.status).toBe(403)
      expect(createRes.body.message).toContain('permission')
    })

    test('Shop should be able to create products', async () => {
      const email = 'shop_create@test.com'
      await signup(app, { email, password: TEST_PASSWORD, name: 'Shop Create' })
      await activateUser(email)

      // Promote to shop role
      const { UserModel } = await import('#modules/auth/models/user.model.js')
      await UserModel.findOneAndUpdate({ user_email: email }, { user_role: 'shop' })

      const { token, userId } = await login(app, { email, password: TEST_PASSWORD })

      // Create a Shop document for the shop user
      const shopModel = (await import('#modules/shop/models/shop.model.js')).default
      const shopDoc = await shopModel.create({
        shop_name: 'Test Shop',
        shop_owner: userId,
        shop_slug: 'test-shop',
        shop_status: 'active'
      })

      const res = await http(app)
        .post('/v1/api/product/')
        .set(authHeaders({ token, userId }))
        .send({
          spu_name: 'Shop Product',
          spu_thumb: 'https://test.com/image.jpg',
          spu_price: 1000,
          spu_quantity: 10,
          spu_type: 'Electronic',
          spu_category: ['electronic'],
          spu_shopId: shopDoc._id.toString(),
          spu_attributes: [
            { attr_id: global.testAttrId, attr_value: 'ShopBrand' }
          ]
        })

      if (res.status !== 201) console.error('Shop Create Fail:', JSON.stringify(res.body, null, 2))
      expect(res.status).toBe(201)
    })
  })
})