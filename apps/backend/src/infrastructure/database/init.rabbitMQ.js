// src/services/rabbitmq.service.js
import amqp from 'amqplib'
import { env } from '#infrastructure/config/environment.config.js'
import orderWorker from '#infrastructure/workers/order.worker.js'
import inventoryWorker from '#infrastructure/workers/inventory.worker.js'


let channel = null

const connectRabbitMQ = async () => {
  try {

    const connection = await amqp.connect(`${env.RABBITMQ_HOST}:${env.RABBITMQ_PORT}`)
    channel = await connection.createChannel()

    await channel.assertQueue('inventory_queue', { durable: true })

    await setupDelayQueue(channel)
    console.log('RabbitMQ Delay Queue Setup Success!')

    await inventoryWorker.ListenToReserveInventory(channel)
    console.log('Inventory worker run success')
    await orderWorker.listenToCancelOrderQueue(channel)
    console.log('order worker run success')
    await inventoryWorker.ListenToInventoryHistoryQueue(channel)

    console.log('RabbitMQ Connected!')
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error)
  }
}

const publishMessage = async (queueName, data) => {
  if (!channel) throw new Error('RabbitMQ Channel not already!')
  const messageBuffer = Buffer.from(JSON.stringify(data))
  channel.sendToQueue(queueName, messageBuffer, { persistent: true })
}

//set up những exchange bind và queue (tạo)
const setupDelayQueue = async (channel) => {
  const DELAY_EX = 'order_delay_exchange'
  const DELAY_QUEUE = 'order_delay_queue'
  const CANCEL_QUEUE = 'order_cancel_queue'
  await channel.assertExchange(DELAY_EX, 'direct', { durable: true })
  await channel.assertQueue(CANCEL_QUEUE, { durable: true })
  await channel.bindQueue(CANCEL_QUEUE, DELAY_EX, 'cancel_order')
  await channel.assertQueue(DELAY_QUEUE, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': DELAY_EX,
      'x-dead-letter-routing-key': 'cancel_order',
      'x-message-ttl': 15 * 60 * 1000 // 15 phút
    }
  })
}
//hàm gửi mã order lên queue và xử lý ở worker
const sendOrderToDelayQueue = async (orderId) => {
  if (!channel) throw new Error('RabbitMQ channel is not ready')
  await channel.sendToQueue('order_delay_queue', Buffer.from(JSON.stringify({ orderId })), {
    persistent: true
  })
}

await connectRabbitMQ()
export const RabbitMQClient = {
  connectRabbitMQ,
  publishMessage,
  setupDelayQueue,
  sendOrderToDelayQueue
}