// src/services/rabbitmq.service.js
import amqp from 'amqplib'
import { env } from '#infrastructure/config/environment.config.js'
import orderWorker from '#infrastructure/workers/order.worker.js'
import inventoryWorker from '#infrastructure/workers/inventory.worker.js'
import flashsaleWorker from '#infrastructure/workers/flashSale.worker.js'

let channel = null

const connectRabbitMQ = async () => {
  try {

    const connection = await amqp.connect(`${env.RABBITMQ_HOST}:${env.RABBITMQ_PORT}`)
    channel = await connection.createChannel()

    await channel.assertQueue('inventory_queue', { durable: true })

    await setupDelayOrderQueue(channel)
    console.log('RabbitMQ Delay Order Queue Setup Success!')

    await setupTimeStartFlashsale(channel)
    console.log('RabbitMQ Time Start Flashsale Queue Setup Success!')

    await setupTimeEndFlashsale(channel)
    console.log('RabbitMQ Time End Flashsale Queue Setup Success!')

    await inventoryWorker.ListenToReserveInventory(channel)
    console.log('Inventory worker run success')

    await orderWorker.listenToCancelOrderQueue(channel)
    console.log('order worker run success')

    await inventoryWorker.ListenToInventoryHistoryQueue(channel)
    console.log('Inventory history worker run success')

    await flashsaleWorker.listenStartFlashSaleQueue(channel)
    console.log('Flashsale start campaign worker run success')

    await flashsaleWorker.listenEndFlashSaleQueue(channel)
    console.log('Flashsale end campaign worker run success')

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

//set up những exchange bind và queue (tạo) cho order
const setupDelayOrderQueue = async (channel) => {
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

//set up time start flashsale
const setupTimeStartFlashsale = async (channel) => {
  const EXCHANGE = 'flashsale_exchange'
  const DELAY_QUEUE = 'flashsale_delay_queue'
  const START_QUEUE = 'flashsale_start_queue'

  await channel.assertExchange(EXCHANGE, 'direct', { durable: true })
  await channel.assertQueue(START_QUEUE, { durable: true })
  await channel.bindQueue(START_QUEUE, EXCHANGE, 'start_flashsale')
  await channel.assertQueue(DELAY_QUEUE, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': EXCHANGE,
      'x-dead-letter-routing-key': 'start_flashsale'
    }
  })
}
const setupTimeEndFlashsale = async (channel) => {
  const EXCHANGE = 'flashsale_end_exchange'
  const DELAY_QUEUE = 'flashsale_end_delay_queue'
  const END_QUEUE = 'flashsale_end_queue'

  await channel.assertExchange(EXCHANGE, 'direct', { durable: true })
  await channel.assertQueue(END_QUEUE, { durable: true })
  await channel.bindQueue(END_QUEUE, EXCHANGE, 'end_flashsale')
  await channel.assertQueue(DELAY_QUEUE, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': EXCHANGE,
      'x-dead-letter-routing-key': 'end_flashsale'
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

const sendFlashsaleStart = async ({ campaignId, startTime }) => {
  if (!channel) throw new Error('RabbitMQ channel is not ready')
  const delay = new Date(startTime).getTime() - Date.now()
  if (delay < 0) return
  await channel.sendToQueue('flashsale_delay_queue', Buffer.from(JSON.stringify({ campaignId })), {
    expiration: delay.toString(),
    persistent: true
  })
}

const sendFlashsaleEnd = async ({ campaignId, endTime }) => {
  if (!channel) throw new Error('RabbitMQ channel is not ready')
  const delay = new Date(endTime).getTime() - Date.now()
  if (delay < 0) return
  await channel.sendToQueue('flashsale_end_delay_queue', Buffer.from(JSON.stringify({ campaignId })), {
    expiration: delay.toString(),
    persistent: true
  })
}

await connectRabbitMQ()
export const RabbitMQClient = {
  connectRabbitMQ,
  publishMessage,
  sendOrderToDelayQueue,
  sendFlashsaleStart,
  sendFlashsaleEnd
}