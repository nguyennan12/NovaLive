import { RabbitMQClient } from '#infrastructure/database/init.rabbitMQ'
import { redisClient } from '#infrastructure/database/init.redis'
import MyLogger from '#infrastructure/loggers/MyLogger'
import ApiError from '#shared/core/error.response.js'
import { checkTimeStatus } from '#shared/helpers/time.helper.js'
import { StatusCodes } from 'http-status-codes'

const createCampaing = async (reqBody) => {
  const { campaign_name, start_time, end_time } = reqBody
  const timeCheck = checkTimeStatus(start_time, end_time)
  if (!timeCheck.isValid) {
    throw new ApiError(StatusCodes.BAD_REQUEST, timeCheck.message)
  }
  const newCampaign = await flashSaleCampaignModel.create({
    campaign_name,
    start_time,
    end_time,
    status: 'draft',
    ...reqBody
  })

  try {
    await RabbitMQClient.sendFlashsaleStart({ campaignId: newCampaign._id, startTime: newCampaign.start_time })
    MyLogger.info('Send to queue flash sale success!', 'WORKER_FLASHSALE')
  } catch (e) {
    MyLogger.error('Error when send to queue flash sale', 'WORKER_FLASHSALE')
  }

  return newCampaign
}

export default {
  createCampaing
}