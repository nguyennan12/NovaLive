import mongoose from 'mongoose'
import { UserModel } from '../../../src/models/user.model.js'
import { env } from '../../../src/config/environment.config.js'
import bcrypt from 'bcrypt'
import converter from '../../../src/utils/converter.js'

async function seedAdmin() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(env.DEV_MONGODB_URI || 'mongodb://localhost:27017/livestream-ecommerce')
  
  const email = 'admin@test.com'
  const password = await bcrypt.hash('Admin12345', 10)
  
  let admin = await UserModel.findOne({ user_email: email })
  if (!admin) {
    admin = await UserModel.create({
      user_email: email,
      user_password: password,
      user_name: 'System Admin',
      user_slug: 'system-admin',
      user_role: 'admin',
      user_status: 'active'
    })
    console.log('Admin user created: admin@test.com / Admin12345')
  } else {
    admin.user_role = 'admin'
    admin.user_status = 'active'
    await admin.save()
    console.log('User admin@test.com promoted to admin.')
  }
  
  process.exit(0)
}

seedAdmin().catch(console.error)
