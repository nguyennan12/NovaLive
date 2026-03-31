import tokenModel from '#models/token.model.js'

const createToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
  const filter = { userId: userId }
  const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken }
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }

  return await tokenModel.findOneAndUpdate(filter, update, options)
}

export default {
  createToken
}