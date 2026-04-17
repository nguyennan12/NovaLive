import livestreamModel from '#models/livestream.model.js'
import converter from '#utils/converter.js'

const findLiveByIdAndType = async (liveId, type) => {
  return await livestreamModel.findOne({ _id: converter.toObjectId(liveId), live_status: type }).lean()
}

export default {
  findLiveByIdAndType
}