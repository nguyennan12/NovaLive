import mongoose from 'mongoose'
import resourceModel from '../../../src/models/resource.model.js'
import roleModel from '../../../src/models/role.model.js'
import { env } from '../../../src/config/environment.config.js'

async function seed() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(env.DEV_MONGODB_URI || 'mongodb://localhost:27017/livestream-ecommerce')
  console.log('Connected to:', env.DEV_MONGODB_URI || 'localhost')

  // 1. Expanded Resources
  const resources = [
    { name: 'PRODUCT', description: 'Product Management (SPU/SKU)' },
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
    { name: 'CART', description: 'Shopping Cart Management' }
  ]

  const resourceDocs = []
  for (const res of resources) {
    let doc = await resourceModel.findOne({ src_name: res.name })
    if (!doc) {
      doc = await resourceModel.create({ src_name: res.name, src_description: res.description })
      console.log(`Created Resource: ${res.name}`)
    } else {
      doc.src_description = res.description
      await doc.save()
    }
    resourceDocs.push(doc)
  }

  const getResId = (name) => resourceDocs.find(r => r.src_name === name)._id

  // 2. Comprehensive Role Grants
  const roles = [
    {
      name: 'admin',
      description: 'System Administrator - Full Access',
      grants: resources.map(res => ({
        resourceId: getResId(res.name),
        actions: ['create:any', 'read:any', 'update:any', 'delete:any'],
        attributes: '*'
      }))
    },
    {
      name: 'shop',
      description: 'Shop Owner - Managed Shop Assets',
      grants: [
        { resourceId: getResId('PRODUCT'), actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' },
        { resourceId: getResId('ORDER'), actions: ['read:own', 'update:own'], attributes: '*' },
        { resourceId: getResId('LIVESTREAM'), actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' },
        { resourceId: getResId('SHOP'), actions: ['read:own', 'update:own'], attributes: '*' },
        { resourceId: getResId('CATEGORY'), actions: ['read:any'], attributes: '*' },
        { resourceId: getResId('DISCOUNT'), actions: ['create:own', 'read:own', 'update:own', 'delete:own'], attributes: '*' },
        { resourceId: getResId('INVENTORY'), actions: ['create:own', 'read:own', 'update:own'], attributes: '*' },
        { resourceId: getResId('FLASH_SALE'), actions: ['create:own', 'read:own', 'update:own'], attributes: '*' }
      ]
    },
    {
      name: 'user',
      description: 'Customer - Personal Shopping',
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
    const found = await roleModel.findOne({ role_name: role.name })
    if (!found) {
      await roleModel.create({
        role_name: role.name,
        role_description: role.description,
        role_grants: role.grants
      })
      console.log(`Created Role: ${role.name}`)
    } else {
      found.role_description = role.description
      found.role_grants = role.grants
      await found.save()
      console.log(`Updated Role: ${role.name}`)
    }
  }

  console.log('Comprehensive RBAC Seeding completed successfully.')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
