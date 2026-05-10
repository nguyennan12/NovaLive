import ApiError from '#shared/core/error.response.js'
import userRepo from '#modules/auth/repos/user.repo.js'
import { StatusCodes } from 'http-status-codes'

const UPDATABLE_FIELD_MAP = {
  user_name: 'user_name',
  user_phone: 'user_phone',
  user_gender: 'user_sex',
  user_birthday: 'user_date_of_birth',
  user_avatar: 'user_avatar'
}

const formatProfile = (user) => ({
  _id: user._id,
  user_name: user.user_name,
  user_email: user.user_email,
  user_phone: user.user_phone || '',
  user_gender: user.user_sex || '',
  user_birthday: user.user_date_of_birth || null,
  user_avatar: user.user_avatar || '',
  user_shop: user.user_shop || null,
  default_address_id: user.default_address_id || null,
  isVerified: user.user_status === 'active'
})

const getMe = async ({ userId }) => {
  const user = await userRepo.findUserById(userId)
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  return formatProfile(user)
}

const updateMe = async ({ userId, data }) => {
  const dbData = {}
  for (const [frontendKey, dbKey] of Object.entries(UPDATABLE_FIELD_MAP)) {
    if (data[frontendKey] !== undefined) dbData[dbKey] = data[frontendKey]
  }
  if (Object.keys(dbData).length === 0)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Không có trường hợp lệ để cập nhật')

  const updated = await userRepo.updateUserById({ userId, data: dbData })
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  return formatProfile(updated)
}

export default { getMe, updateMe }
