import resourceModel from '#models/resource.model.js'
import roleModel from '#models/role.model.js'
import slugify from 'slugify'

export async function seedRBAC() {
  const resources = [
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

  const resourceDocs = []
  for (const res of resources) {
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
      name: 'admin',
      description: 'System Administrator',
      grants: resources.map(res => ({
        resourceId: getResId(res.name),
        actions: ['create:any', 'read:any', 'update:any', 'delete:any'],
        attributes: '*'
      }))
    },
    {
      name: 'shop',
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
      name: 'user',
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
    }
  ]

  for (const role of roles) {
    await roleModel.findOneAndUpdate(
      { role_name: role.name },
      {
        role_name: role.name,
        role_description: role.description,
        role_grants: role.grants
      },
      { upsert: true }
    )
  }

  // Seed default admin user for tests
  const { UserModel } = await import('#models/user.model.js')
  const bcrypt = await import('bcrypt')
  const adminPass = await bcrypt.default.hash('Admin12345', 10)
  await UserModel.findOneAndUpdate(
    { user_email: 'admin@test.com' },
    {
      user_email: 'admin@test.com',
      user_password: adminPass,
      user_name: 'Global Admin',
      user_slug: 'global-admin',
      user_role: 'admin',
      user_status: 'active'
    },
    { upsert: true }
  )
}
