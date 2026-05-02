// 'use strict'

// const crypto = require('crypto')

// /**
//  * In-memory token store shared between testFactory and testApp's auth middleware.
//  * Maps accessToken string → user payload { userId, email, role, shopId }.
//  */
// const tokenStore = new Map()

// /**
//  * Create a mock authenticated session.
//  * Registers token in tokenStore so testApp's auth middleware accepts it.
//  */
// function createSession(opts = {}) {
//   const userId = opts.userId || `usr_${crypto.randomBytes(6).toString('hex')}`
//   const accessToken = crypto.randomBytes(16).toString('hex')
//   const user = {
//     userId,
//     email: opts.email || `${userId}@example.com`,
//     role: opts.role || 'USER',
//     shopId: opts.shopId || null,
//   }
//   tokenStore.set(accessToken, user)
//   return {
//     userId,
//     accessToken,
//     refreshToken: crypto.randomBytes(16).toString('hex'),
//     user,
//   }
// }

// function createBuyerSession(extra = {}) {
//   return createSession({ role: 'USER', ...extra })
// }

// function createAdminSession(extra = {}) {
//   return createSession({ role: 'ADMIN', ...extra })
// }

// function createSellerSession(shopId = 'shop_test_001', extra = {}) {
//   return createSession({ role: 'USER', shopId, ...extra })
// }

// function clearSessions() {
//   tokenStore.clear()
// }

// // ─── Mock data builders ────────────────────────────────────────────────────────

// const mockUser = (overrides = {}) => ({
//   _id: `usr_${crypto.randomBytes(4).toString('hex')}`,
//   user_name: 'Test User',
//   user_email: 'buyer@example.com',
//   user_shop: null,
//   default_address_id: null,
//   ...overrides,
// })

// const mockTokens = () => ({
//   accessToken: crypto.randomBytes(16).toString('hex'),
//   refreshToken: crypto.randomBytes(16).toString('hex'),
// })

// const mockShop = (overrides = {}) => ({
//   _id: 'shop_001',
//   name: 'Test Shop',
//   description: 'A test shop',
//   owner: 'usr_001',
//   ...overrides,
// })

// const mockProduct = (overrides = {}) => ({
//   _id: 'prod_001',
//   name: 'Test Product',
//   description: 'A test product',
//   price: 100000,
//   shopId: 'shop_001',
//   skus: [
//     { _id: 'sku_001', price: 100000, stock: 5, attributes: { color: 'red', size: 'M' } },
//   ],
//   ...overrides,
// })

// const mockSku = (overrides = {}) => ({
//   _id: 'sku_001',
//   productId: 'prod_001',
//   price: 100000,
//   stock: 5,
//   attributes: { color: 'red', size: 'M' },
//   ...overrides,
// })

// const mockAddress = (overrides = {}) => ({
//   _id: 'addr_001',
//   fullName: 'Nguyen Van A',
//   phone: '0900000001',
//   province: 'Hồ Chí Minh',
//   district: 'Quận 1',
//   ward: 'Phường Bến Nghé',
//   detail: '123 Test St',
//   isDefault: true,
//   ...overrides,
// })

// const mockDiscount = (code = 'SAVE10', overrides = {}) => ({
//   _id: 'disc_001',
//   code,
//   type: 'percentage',
//   value: 10,
//   startDate: new Date(Date.now() - 86400000).toISOString(),
//   endDate: new Date(Date.now() + 86400000).toISOString(),
//   minOrderValue: 0,
//   ...overrides,
// })

// const mockOrder = (overrides = {}) => ({
//   _id: 'order_001',
//   userId: 'usr_001',
//   total: 200000,
//   status: 'pending',
//   paymentMethod: 'COD',
//   paymentStatus: 'unpaid',
//   ...overrides,
// })

// const mockLivestream = (overrides = {}) => ({
//   _id: 'live_001',
//   title: 'Test Livestream',
//   shopId: 'shop_001',
//   status: 'scheduled',
//   scheduledAt: new Date(Date.now() + 3600000).toISOString(),
//   ...overrides,
// })

// module.exports = {
//   tokenStore,
//   createSession,
//   createBuyerSession,
//   createAdminSession,
//   createSellerSession,
//   clearSessions,
//   mockUser,
//   mockTokens,
//   mockShop,
//   mockProduct,
//   mockSku,
//   mockAddress,
//   mockDiscount,
//   mockOrder,
//   mockLivestream,
// }
