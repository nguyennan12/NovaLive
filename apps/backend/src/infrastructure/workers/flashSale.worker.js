import MyLogger from '#infrastructure/loggers/MyLogger.js'
import { flashSaleCampaignModel } from '#modules/flashSale/models/flashSaleCampaign.model.js'

const listenStartFlashSaleQueue = async (channel) => {
  const queueName = 'flashsale_start_queue'
  channel.consume(queueName, async (msg) => {
    const payload = JSON.parse(msg.content.toString())
    MyLogger.info(`Accept campaign flashsale ${payload.campaignId}`, 'CAMPAIGN_START')
    try {
      // Guard: only activate if still in draft (prevents re-activating cancelled/completed campaigns)
      await flashSaleCampaignModel.findOneAndUpdate(
        { _id: payload.campaignId, status: 'draft' },
        { status: 'active' },
        { returnDocument: 'after' }
      )
      MyLogger.info(`Start campaign flashsale ${payload.campaignId} successfully!`, 'CAMPAIGN_START')
      channel.ack(msg)
    } catch {
      MyLogger.error(`Error start campaign flashsale ${payload.campaignId}`, 'CAMPAIGN_START')
      channel.nack(msg, false, false)
    }
  })
}

const listenEndFlashSaleQueue = async (channel) => {
  const queueName = 'flashsale_end_queue'
  channel.consume(queueName, async (msg) => {
    const payload = JSON.parse(msg.content.toString())
    MyLogger.info(`Accept end campaign flashsale ${payload.campaignId}`, 'CAMPAIGN_END')
    try {
      await flashSaleCampaignModel.findOneAndUpdate(
        { _id: payload.campaignId, status: 'active' },
        { status: 'completed' },
        { returnDocument: 'after' }
      )
      MyLogger.info(`End campaign flashsale ${payload.campaignId} successfully!`, 'CAMPAIGN_END')
      channel.ack(msg)
    } catch {
      MyLogger.error(`Error end campaign flashsale ${payload.campaignId}`, 'CAMPAIGN_END')
      channel.nack(msg, false, false)
    }
  })
}

export default {
  listenStartFlashSaleQueue,
  listenEndFlashSaleQueue
}