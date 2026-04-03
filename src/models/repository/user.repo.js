import { UserModel } from '#models/user.model.js'
import converter from '#utils/converter.js'
import data from '#utils/data.js'

const findUserByEmail = async ({ email }) => {
  return await UserModel.findOne({ user_email: email }).lean()
}

const findUserById = async (userId) => {
  return await UserModel.findById(userId).lean()
}

const createUser = async ({ email, password }) => {
  const name = data.getNameFromEmail(email)
  const slug = converter.toSlug(name)
  return await UserModel.create({
    user_email: email, user_password: password,
    user_slug: slug, user_name: name
  })
}

const changeStatus = async ({ email, status = 'active' }) => {
  return await UserModel.findOneAndUpdate(
    { user_email: email },
    { user_status: status },
    { returnDocument: 'after' }
  )
}

const changeRole = async ({ userId, role }) => {
  return await UserModel.updateOne({ _id: userId }, { $set: { user_role: role } })
}

export default {
  findUserByEmail,
  findUserById,
  createUser,
  changeStatus,
  changeRole
}