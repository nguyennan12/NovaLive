// file nay chay ngam
import amqp from 'amqplib'
import inventoryModel from '#models/inventory.model.js'

const runWorker = async () => {
  const connection = await amqp.connect('amqp://localhost:5672')
  const channel = await connection.createChannel()
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
              filter: { inven_skuId: item.skuId },
              update: {
                $inc: { inven_reserved: item.quantity },
                $push: { inven_reservations: { orderId: data.orderId, quantity: item.quantity } }
              }
            }
          }))
          await inventoryModel.bulkWrite(operations)
        }

        channel.ack(msg)

      } catch (error) {
        console.error(`[Worker Error DB] Order ${data.orderId}:`, error)
      }
    }
  }, { noAck: false })
}

runWorker()