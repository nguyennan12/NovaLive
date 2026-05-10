import { UserModel } from '#modules/auth/models/user.model.js'
import converter from '#shared/utils/converter.js'
import data from '#shared/utils/data.js'

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

const changeRole = async ({ userId, role, shopId = null }) => {
  return await UserModel.updateOne({ _id: userId }, { $set: { user_role: role, user_shop: converter.toObjectId(shopId) } })
}

const updateUserById = async ({ userId, data }) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, lean: true }
  )
}

export default {
  findUserByEmail,
  findUserById,
  createUser,
  changeStatus,
  changeRole,
  updateUserById
}