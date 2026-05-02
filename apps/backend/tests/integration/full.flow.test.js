import inventoryModel from '#models/inventory.model.js'
import { skuModel } from '#models/sku.model.js'
import { createRealApp } from '../helpers/appFactory.js'
import { activateUser, authHeaders, login, signup } from '../helpers/auth.js'
import { http } from '../helpers/http.js'

let app
let sellerToken, sellerId, buyerToken, buyerId, adminToken, adminId
let shopId, productId, skuId, orderId, addressId, cartId

beforeAll(async () => {
  app = await createRealApp()

  // Seed RBAC
  const rbacService = (await import('#services/rbac.service.js')).default
  const productRes = await rbacService.createResource({ name: 'PRODUCT', description: 'Product' })
  const orderRes = await rbacService.createResource({ name: 'ORDER', description: 'Order' })
  const categoryRes = await rbacService.createResource({ name: 'CATEGORY', description: 'Category' })
  const attrRes = await rbacService.createResource({ name: 'ATTRIBUTE', description: 'Attribute' })
  const addressRes = await rbacService.createResource({ name: 'ADDRESS', description: 'Address' })
  const cartRes = await rbacService.createResource({ name: 'CART', description: 'Cart' })
  const shopRes = await rbacService.createResource({ name: 'SHOP', description: 'Shop' })
  const paymentRes = await rbacService.createResource({ name: 'PAYMENT', description: 'Payment' })

  await rbacService.createRole({
    name: 'admin',
    grants: [
      { resourceId: productRes._id, actions: ['read:any', 'create:any', 'update:any', 'delete:any'], attributes: '*' },
      { resourceId: orderRes._id, actions: ['read:any', 'create:any', 'update:any', 'delete:any'], attributes: '*' },
      { resourceId: categoryRes._id, actions: ['read:any', 'create:any', 'update:any', 'delete:any'], attributes: '*' },
      { resourceId: attrRes._id, actions: ['read:any', 'create:any', 'update:any', 'delete:any'], attributes: '*' },
      { resourceId: shopRes._id, actions: ['read:any', 'create:any', 'update:any', 'delete:any'], attributes: '*' },
      { resourceId: paymentRes._id, actions: ['read:any', 'create:any', 'update:any', 'delete:any'], attributes: '*' }
    ]
  })
  await rbacService.createRole({
    name: 'shop',
    grants: [
      { resourceId: productRes._id, actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' },
      { resourceId: orderRes._id, actions: ['read:own', 'update:own'], attributes: '*' },
      { resourceId: shopRes._id, actions: ['read:own', 'update:own'], attributes: '*' },
      { resourceId: categoryRes._id, actions: ['read:any'], attributes: '*' },
      { resourceId: paymentRes._id, actions: ['create:own'], attributes: '*' }
    ]
  })
  await rbacService.createRole({
    name: 'user',
    grants: [
      { resourceId: productRes._id, actions: ['read:any'], attributes: '*' },
      { resourceId: addressRes._id, actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' },
      { resourceId: cartRes._id, actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' },
      { resourceId: orderRes._id, actions: ['create:own', 'read:own'], attributes: '*' }
    ]
  })

  const { initAccessControl } = await import('#config/rbac.config.js')
  await initAccessControl()
})

const TEST_PASSWORD = 'abc12345'
const SELLER_EMAIL = 'seller@test.com'
const BUYER_EMAIL = 'buyer@test.com'
const ADMIN_EMAIL = 'admin@test.com'

describe('Full E-commerce Flow (Split steps)', () => {

  test('Step 0: Admin Setup', async () => {
    // Login with global admin seeded in rbacSeed.js
    const loginRes = await login(app, { email: 'admin@test.com', password: 'Admin12345' })
    adminToken = loginRes.token
    adminId = loginRes.userId
  })

  test('Step 1: Seller Setup & Shop Registration', async () => {
    await signup(app, { email: SELLER_EMAIL, password: TEST_PASSWORD, name: 'Seller' })
    await activateUser(SELLER_EMAIL)
    const { UserModel } = await import('#models/user.model.js')
    await UserModel.findOneAndUpdate({ user_email: SELLER_EMAIL }, { user_role: 'shop' })
    const loginRes = await login(app, { email: SELLER_EMAIL, password: TEST_PASSWORD })
    sellerToken = loginRes.token
    sellerId = loginRes.userId

    const shopRes = await http(app)
      .post('/v1/api/shop/register')
      .set(authHeaders({ token: sellerToken, userId: sellerId }))
      .send({
        name: 'My Shop',
        address: {
          street: '123 St', ward: 'W1', district: 'D1', province: 'P1',
          province_id: 1, district_id: 1, ward_code: '1'
        },
        contact: '0123456789'
      })
    expect(shopRes.status).toBe(201)
    shopId = shopRes.body.metadata.id || shopRes.body.metadata._id

    // Relogin to update JWT with shopId
    const relogin = await login(app, { email: SELLER_EMAIL, password: TEST_PASSWORD })
    sellerToken = relogin.token
  })

  test('Step 2: Category & Product Creation', async () => {
    // Category setup
    const catRes = await http(app)
      .post('/v1/api/category')
      .set(authHeaders({ token: adminToken, userId: adminId }))
      .send({ name: 'Electronics' })

    if (catRes.status !== 201) console.error('Cat Create Fail:', catRes.body)
    expect(catRes.status).toBe(201)
    const categoryId = catRes.body.metadata.cat_id // Use cat_id for later routes
    const categorySlug = catRes.body.metadata.cat_slug

    // Create Attribute
    const attributeModel = (await import('#models/attribute.model.js')).default
    const attrDoc = await attributeModel.create({
      attr_name: 'Color',
      attr_id: 'color_attr',
      attr_type: 'text'
    })
    const attributeId = attrDoc.attr_id

    await http(app)
      .post(`/v1/api/category/${categoryId}/attribute`)
      .set(authHeaders({ token: adminToken, userId: adminId }))
      .send({ attributeId, isRequired: true, displayOrder: 1 })

    // Product creation
    const prodRes = await http(app)
      .post('/v1/api/product/')
      .set(authHeaders({ token: sellerToken, userId: sellerId }))
      .send({
        spu_name: 'iPhone 15',
        spu_thumb: 'thumb_url',
        spu_description: 'New iPhone',
        spu_price: 1000,
        spu_quantity: 50,
        spu_shopId: shopId.toString(),
        spu_category: [categorySlug],
        spu_attributes: [{ attr_id: attributeId, attr_value: 'Natural Titanium' }],
        isPublished: true
      })
    if (prodRes.status !== 201) console.error('Product Create Fail:', prodRes.body)
    expect(prodRes.status).toBe(201)
    productId = prodRes.body.metadata._id
    const sku = await skuModel.findOne({ sku_spuId: productId })
    skuId = sku._id.toString()
  })

  test('Step 3: Buyer Ordering Flow', async () => {
    // Buyer setup
    await signup(app, { email: BUYER_EMAIL, password: TEST_PASSWORD, name: 'Buyer' })
    await activateUser(BUYER_EMAIL)
    const { UserModel } = await import('#models/user.model.js')
    await UserModel.findOneAndUpdate({ user_email: BUYER_EMAIL }, { user_role: 'user' })
    const buyerLogin = await login(app, { email: BUYER_EMAIL, password: TEST_PASSWORD })
    buyerToken = buyerLogin.token
    buyerId = buyerLogin.userId

    // Add Address
    const addrRes = await http(app)
      .post('/v1/api/address')
      .set(authHeaders({ token: buyerToken, userId: buyerId }))
      .send({
        name: 'Home', phone: '0111222333',
        street: '456 St', ward: 'W2', district: 'D2', province: 'P2',
        province_id: 2, district_id: 2, ward_code: '2',
        owner_type: 'user'
      })
    if (addrRes.status !== 200) console.error('Address Create Fail:', addrRes.body)
    expect(addrRes.status).toBe(200)
    addressId = addrRes.body.metadata._id

    // Add to Cart
    await http(app)
      .post('/v1/api/cart')
      .set(authHeaders({ token: buyerToken, userId: buyerId }))
      .send({ skuId, quantity: 2, shopId })

    // Get Cart info for ordering
    const cartRes = await http(app)
      .get('/v1/api/cart')
      .set(authHeaders({ token: buyerToken, userId: buyerId }))
    cartId = cartRes.body.metadata.cartId

    // Order
    const orderRes = await http(app)
      .post('/v1/api/order')
      .set(authHeaders({ token: buyerToken, userId: buyerId }))
      .send({
        cartId,
        userAddressId: addressId,
        shopOrderIds: [{
          shopId,
          item_products: [{ price: 1000, quantity: 2, productId, skuId }]
        }],
        userPayment: 'cod',
        client_totalCheckout: 2000 + 15000 // Price (1000*2) + Shipping (15000)
      })
    if (orderRes.status !== 200) console.error('Order Fail:', orderRes.body)
    expect(orderRes.status).toBe(200)
    orderId = orderRes.body.metadata._id
  })

  test('Step 4: Payment Confirmation & Inventory Deduction', async () => {
    // Get OTP for Buyer
    const otpModel = (await import('#models/otp.model.js')).default
    const otpDoc = await otpModel.findOne({ otp_email: BUYER_EMAIL }).sort({ createdAt: -1 })

    // Confirm COD Payment
    const confirmRes = await http(app)
      .post('/v1/api/payment/cod')
      .set(authHeaders({ token: sellerToken, userId: sellerId }))
      .send({
        orderId,
        email: BUYER_EMAIL,
        otpToken: otpDoc.otp_token
      })
    if (confirmRes.status !== 200) console.error('Payment Confirm Fail:', confirmRes.body)
    expect(confirmRes.status).toBe(200)

    // Verify Inventory Deduction
    const inventory = await inventoryModel.findOne({ inven_skuId: skuId })

    // Initial was 50, ordered 2 -> should be 48
    expect(inventory.inven_stock).toBe(48)
    expect(inventory.inven_reservations).toHaveLength(0)
  })
})
