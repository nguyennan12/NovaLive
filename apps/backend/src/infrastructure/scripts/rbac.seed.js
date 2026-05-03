import resourceModel from '#modules/rbac/models/resource.model.js'
import roleModel from '#modules/rbac/models/role.model.js'
import slugify from 'slugify'

const RESOURCES = [
  { name: 'PRODUCT', description: 'Product Management' },
  { name: 'ORDER', description: 'Order Management' },
  { name: 'LIVESTREAM', description: 'Livestream Management' },
  { name: 'USER', description: 'User Management' },
  { name: 'RBAC', description: 'RBAC Management' },
  { name: 'SHOP', description: 'Shop Management' },
  { name: 'CATEGORY', description: 'Category Management' },
  { name: 'DISCOUNT', description: 'Discount & Voucher Management' },
  { name: 'INVENTORY', description: 'Inventory & Stock Management' },
  { name: 'ADDRESS', description: 'User Address Management' },
  { name: 'FLASH_SALE', description: 'Flash Sale Campaign Management' },
  { name: 'CART', description: 'Shopping Cart Management' },
  { name: 'PAYMENT', description: 'Payment Management' }
]

export async function seedRBAC() {
  const resourceDocs = []
  for (const res of RESOURCES) {
    const slug = slugify(res.name, { lower: true })
    const doc = await resourceModel.findOneAndUpdate(
      { src_name: res.name },
      { src_name: res.name, src_description: res.description, src_slug: slug },
      { upsert: true, returnDocument: 'after' }
    )
    resourceDocs.push(doc)
  }

  const getResId = (name) => resourceDocs.find(r => r.src_name === name)._id

  const roles = [
    {
      name: 'user',
      parent: '',
      description: 'Customer',
      grants: [
        { resourceId: getResId('PRODUCT'), actions: ['read:any'], attributes: '*' },
        { resourceId: getResId('LIVESTREAM'), actions: ['read:any'], attributes: '*' },
        { resourceId: getResId('SHOP'), actions: ['read:any'], attributes: '*' },
        { resourceId: getResId('CATEGORY'), actions: ['read:any'], attributes: '*' },
        { resourceId: getResId('DISCOUNT'), actions: ['read:any'], attributes: '*' },
        { resourceId: getResId('CART'), actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' },
        { resourceId: getResId('ORDER'), actions: ['create:own', 'read:own'], attributes: '*' },
        { resourceId: getResId('ADDRESS'), actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' }
      ]
    },
    {
      name: 'shop',
      // shop kế thừa tất cả quyền của user (cart, order, address, ...) + có thêm quyền quản lý shop
      parent: 'user',
      description: 'Shop Owner',
      grants: [
        { resourceId: getResId('PRODUCT'), actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' },
        { resourceId: getResId('ORDER'), actions: ['read:own', 'update:own'], attributes: '*' },
        { resourceId: getResId('LIVESTREAM'), actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' },
        { resourceId: getResId('SHOP'), actions: ['read:own', 'update:own'], attributes: '*' },
        { resourceId: getResId('CATEGORY'), actions: ['read:any'], attributes: '*' },
        { resourceId: getResId('DISCOUNT'), actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' },
        { resourceId: getResId('INVENTORY'), actions: ['create:own', 'read:own', 'update:own'], attributes: '*' },
        { resourceId: getResId('PAYMENT'), actions: ['create:own'], attributes: '*' }
      ]
    },
    {
      name: 'admin',
      parent: '',
      description: 'System Administrator',
      grants: RESOURCES.map(res => ({
        resourceId: getResId(res.name),
        actions: ['create:any', 'read:any', 'update:any', 'delete:any'],
        attributes: '*'
      }))
    }
  ]

  for (const role of roles) {
    await roleModel.findOneAndUpdate(
      { role_name: role.name },
      { role_name: role.name, role_description: role.description, role_grants: role.grants, role_parent: role.parent },
      { upsert: true }
    )
  }

  console.log('[RBAC] Seed completed: admin, shop, user roles with', RESOURCES.length, 'resources')
}
