import MyLogger from '#infrastructure/loggers/MyLogger.js'
import { flashSaleCampaignModel } from '#modules/flashSale/models/flashSaleCampaign.model'

const listenStartFlashSaleQueue = async (channel) => {
  const queueName = 'flashsale_delay_queue'
  channel.consume(queueName, async (msg) => {
    const payload = JSON.parse(msg.content.toString())
    MyLogger.info(`Accept campain flashsale ${payload.campaignId}`, 'CAMPAIGN_START')
    try {
      await flashSaleCampaignModel.findOneAndUpdate(
        { _id: campaignId },
        { status: 'active' },
        { returnDocument: 'after' }
      )
      MyLogger.info(`Start campaign flashsale ${payload.campaignId} successfully!`, 'CAMPAIGN_START')
      channel.ack(msg)
    } catch {
      MyLogger.info(`error start campain flashsale ${payload.campaignId}`, 'CAMPAIGN_START')
      channel.nack(msg, false, false)
    }
  })
}

export default {
  listenStartFlashSaleQueue
}