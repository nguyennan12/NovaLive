// file nay chay ngam
import inventoryModel from '#modules/inventory/models/inventory.model.js'
import converter from '#shared/utils/converter.js'

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
                $push: { inven_reservations: { orderId: data.orderId, quantity: item.quantity } }
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

export default {
  ListenToReserveInventory
}