import tokenModel from '#models/token.model.js'
import converter from '#utils/converter.js'

const createKeyStore = async ({ userId, publicKey, privateKey, refreshToken }) => {
  const filter = { userId: userId }
  const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken }
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }

  return await tokenModel.findOneAndUpdate(filter, update, options)
}

const getkeyStoreByUserId = async ({ userId }) => {
  return await tokenModel.findOne({ userId }).lean()
}

const deleteKeyStoreById = async (keyStoreId) => {
  return await tokenModel.deleteOne({ _id: converter.toObjectId(keyStoreId) })
}

const deleteKeyStoreByUserId = async (UserId) => {
  return await tokenModel.deleteOne({ UserId })
}

const updateRefreshToken = async ({ oldRefreshToken, newRefreshToken }) => {
  return await tokenModel.updateOne({
    $set: { refreshToken: newRefreshToken },
    $addToSet: { refreshTokenUsed: oldRefreshToken }
  })
}

export default {
  createKeyStore,
  getkeyStoreByUserId,
  deleteKeyStoreById,
  deleteKeyStoreByUserId,
  updateRefreshToken
}