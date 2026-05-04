/* eslint-disable indent */
// file nay chay ngam
import MyLogger from '#infrastructure/loggers/MyLogger.js'
import inventoryModel from '#modules/inventory/models/inventory.model.js'
import converter from '#shared/utils/converter.js'
import inventoryHistoryService from '#modules/inventory/services/inventoryHistory.service.js'
import { skuModel } from '#modules/product/models/sku.model.js'

const ListenToReserveInventory = async (channel) => {
  const queueName = 'inventory_queue'

  await channel.assertQueue(queueName, { durable: true })

  channel.prefetch(1)

  //comsume nhận message, và payload
  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      //chuyển data về json
      const data = JSON.parse(msg.content.toString())
      console.log(`[Worker] Writing DB for order: ${data.orderId}`)

      try {
        //kiểm tra nếu message có action là Reserve_DB
        if (data.action === 'RESERVE_DB') {
          //bulk oper để update inven
          const operations = data.items.map(item => ({
            updateOne: {
              filter: { inven_skuId: converter.toObjectId(item.skuId) },
              update: {
                $inc: { inven_reserved: item.quantity },
                $push: { inven_reservations: { orderId: converter.toObjectId(data.orderId), quantity: item.quantity } }
              }
            }
          }))
          console.log(`[Worker] Executing bulkWrite for ${operations.length} items...`)
          const result = await inventoryModel.bulkWrite(operations)
          console.log(`[Worker] BulkWrite Success! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`)
        }

        channel.ack(msg)

      } catch (error) {
        console.error(`[Worker Error DB] Order ${data.orderId}:`, error)
      }
    }
  }, { noAck: false })
}

const ListenToInventoryHistoryQueue = async (channel) => {
  const queueName = 'inventory_history_queue'

  await channel.assertQueue(queueName, { durable: true })
  MyLogger.info(`Waiting for messages in ${queueName}`, '[INVENTORY_QUEUE]')

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      try {
        const payload = JSON.parse(msg.content.toString())
        switch (payload.action) {
          case 'LOG_SALE_DEDUCT_HISTORY':
            const items = payload.data
            await inventoryHistoryService.createHistorySaleBulk(payload.data)
            MyLogger.info(`Success update history for stock when sale: ${payload.orderId}`, '[INVENTORY_QUEUE]')

            const bulkOps = items.map(item => ({
              updateOne: {
                filter: { _id: converter.toObjectId(item.skuId) },
                update: { $inc: { sku_stock: -item.quantity } }
              }
            }))
            if (bulkOps.length > 0) {
              await skuModel.bulkWrite(bulkOps)
              MyLogger.info(`Success update SKU stock display for order: ${payload.orderId}`, '[INVENTORY_QUEUE]')
            }
            break
          default:
            console.warn(`[!] Unknown action: ${payload.action}`)
        }
        channel.ack(msg)
      } catch {
        MyLogger.error(`error update history stock when sale: ${payload.orderId}`, '[INVENTORY_QUEUE]')
        channel.nack(msg, false, false)
      }
    }
  })
}

export default {
  ListenToReserveInventory,
  ListenToInventoryHistoryQueue
}