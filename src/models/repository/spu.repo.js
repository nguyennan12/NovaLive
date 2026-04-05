import { spuModel } from '#models/spu.model.js'

const findBySpuId = async (spuId) => {
  return await spuModel.findOne({ spu_id: spuId }).lean()
}

export default {
  findBySpuId
}