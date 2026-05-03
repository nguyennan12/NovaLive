import { createRealApp } from '../helpers/appFactory.js'
import { http } from '../helpers/http.js'
import { signup, login, authHeaders, activateUser } from '../helpers/auth.js'
import { skuModel } from '#modules/product/models/sku.model.js'
import orderModel from '#modules/order/models/order.model.js'
import inventoryModel from '#modules/inventory/models/inventory.model.js'
import crypto from 'crypto'
import qs from 'qs'
import { sortObject } from '#shared/helpers/object.helper.js'

let app
let sellerToken, sellerId, buyerToken, buyerId
let shopId, productId, skuId, orderId, addressId, cartId

beforeAll(async () => {
  app = await createRealApp()
})

const TEST_PASSWORD = 'abc12345'
const SELLER_EMAIL = 'seller_vnp@test.com'
const BUYER_EMAIL = 'buyer_vnp@test.com'

const signVnpParams = (params) => {
  const secretKey = 'secret' // Matches process.env.VNP_HASH_SECRET in jest.setup.js
  const sorted = sortObject(params)
  const signData = qs.stringify(sorted, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  return hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
}

describe('Order Payment VNPAY Flow (integration)', () => {

  test('Step 1: Setup Seller & Product', async () => {
    // Admin login (global admin)
    const adminLogin = await login(app, { email: 'admin@test.com', password: 'Admin12345' })
    const adminToken = adminLogin.token
    const adminId = adminLogin.userId

    // Seller setup
    await signup(app, { email: SELLER_EMAIL, password: TEST_PASSWORD, name: 'SellerVNP' })
    await activateUser(SELLER_EMAIL)
    const loginRes = await login(app, { email: SELLER_EMAIL, password: TEST_PASSWORD })
    sellerToken = loginRes.token
    sellerId = loginRes.userId

    const shopRes = await http(app)
      .post('/v1/api/shop/register')
      .set(authHeaders({ token: sellerToken, userId: sellerId }))
      .send({
        name: 'VNP Shop',
        address: { street: '123 St', ward: 'W1', district: 'D1', province: 'P1', province_id: 1, district_id: 1, ward_code: '1' },
        contact: '0123456789'
      })
    shopId = shopRes.body.metadata.id || shopRes.body.metadata._id

    const relogin = await login(app, { email: SELLER_EMAIL, password: TEST_PASSWORD })
    sellerToken = relogin.token

    // Product setup
    const catRes = await http(app)
      .post('/v1/api/category')
      .set(authHeaders({ token: adminToken, userId: adminId }))
      .send({ name: 'VNP Cat' })
    if (catRes.status !== 201) console.error('Cat Fail:', catRes.body)
    expect(catRes.status).toBe(201)
    const categoryId = catRes.body.metadata.cat_id
    const categorySlug = catRes.body.metadata.cat_slug

    // Setup attribute
    const attrRes = await http(app)
      .post('/v1/api/attribute')
      .set(authHeaders({ token: adminToken, userId: adminId }))
      .send({ attr_name: 'Size', attr_type: 'text', attr_id: 'size_vnp' })
    const attributeId = attrRes.body.metadata.attr_id

    await http(app)
      .post(`/v1/api/category/${categoryId}/attribute`)
      .set(authHeaders({ token: adminToken, userId: adminId }))
      .send({ attributeId, isRequired: true, displayOrder: 1 })

    const prodRes = await http(app)
      .post('/v1/api/product/')
      .set(authHeaders({ token: sellerToken, userId: sellerId }))
      .send({
        spu_name: 'VNP Product',
        spu_thumb: 'thumb_url',
        spu_description: 'Test product for vnp',
        spu_price: 1000,
        spu_quantity: 10,
        spu_shopId: shopId.toString(),
        spu_category: [categorySlug],
        spu_attributes: [{ attr_id: attributeId, attr_value: 'M' }],
        isPublished: true
      })
    if (prodRes.status !== 201) console.error('Prod Fail:', prodRes.body)
    expect(prodRes.status).toBe(201)
    productId = prodRes.body.metadata._id
    const sku = await skuModel.findOne({ sku_spuId: productId })
    skuId = sku._id.toString()
  })

  test('Step 2: Place Order with VNPAY', async () => {
    await signup(app, { email: BUYER_EMAIL, password: TEST_PASSWORD, name: 'BuyerVNP' })
    await activateUser(BUYER_EMAIL)
    const buyerLogin = await login(app, { email: BUYER_EMAIL, password: TEST_PASSWORD })
    buyerToken = buyerLogin.token
    buyerId = buyerLogin.userId

    const addrRes = await http(app)
      .post('/v1/api/address')
      .set(authHeaders({ token: buyerToken, userId: buyerId }))
      .send({
        name: 'Home', phone: '0111222333', street: '456 St', ward: 'W2', district: 'D2', province: 'P2',
        province_id: 2, district_id: 2, ward_code: '2', owner_type: 'user'
      })
    addressId = addrRes.body.metadata._id

    await http(app).post('/v1/api/cart').set(authHeaders({ token: buyerToken, userId: buyerId })).send({ skuId, quantity: 1, shopId })
    const cartRes = await http(app).get('/v1/api/cart').set(authHeaders({ token: buyerToken, userId: buyerId }))
    cartId = cartRes.body.metadata.cartId

    const orderRes = await http(app)
      .post('/v1/api/order')
      .set(authHeaders({ token: buyerToken, userId: buyerId }))
      .send({
        cartId,
        userAddressId: addressId,
        shopOrderIds: [{ shopId, item_products: [{ price: 1000, quantity: 1, productId, skuId }] }],
        userPayment: 'vnpay',
        client_totalCheckout: 1000 + 15000
      })
    if (orderRes.status !== 200) console.error('Order Fail:', orderRes.body)
    expect(orderRes.status).toBe(200)
    orderId = orderRes.body.metadata.order_trackingNumber
  })

  test('Step 3: Create Payment URL & Simulate Success IPN', async () => {
    // Create URL
    const urlRes = await http(app)
      .post('/v1/api/payment/create_url')
      .set(authHeaders({ token: buyerToken, userId: buyerId }))
      .send({ orderId, amount: 16000 })
    expect(urlRes.status).toBe(200)
    expect(urlRes.body.metadata.paymentUrl).toContain('vnpay')

    // Simulate IPN
    const vnp_Params = {
      vnp_TxnRef: orderId,
      vnp_Amount: 16000 * 100,
      vnp_ResponseCode: '00',
      vnp_TransactionNo: '123456',
      vnp_BankCode: 'NCB',
      vnp_PayDate: '20210101000000'
    }
    vnp_Params['vnp_SecureHash'] = signVnpParams(vnp_Params)

    const ipnRes = await http(app)
      .get('/v1/api/payment/vnpay_ipn')
      .query(vnp_Params)

    expect(ipnRes.status).toBe(200)
    expect(ipnRes.body.metadata.RspCode).toBe('00')

    // Verify Order Status
    const order = await orderModel.findOne({ order_trackingNumber: orderId })
    expect(order.order_status).toBe('processing')
    expect(order.order_payment.paymentStatus).toBe('paid')

    // Verify Inventory
    const inventory = await inventoryModel.findOne({ inven_skuId: skuId })
    expect(inventory.inven_stock).toBe(9) // 10 - 1
  })
})