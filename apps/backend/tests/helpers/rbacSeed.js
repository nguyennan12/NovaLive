import { seedRBAC as seedRoles } from '#infrastructure/scripts/rbac.seed.js'

// seedRBAC dùng trong tests: seed roles + tạo admin user test
export async function seedRBAC() {
  await seedRoles()

  const { UserModel } = await import('#modules/auth/models/user.model.js')
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
