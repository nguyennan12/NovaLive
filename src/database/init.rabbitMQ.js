// src/services/rabbitmq.service.js
import amqp from 'amqplib'
import { env } from '#config/environment.config.js'

let channel = null

const connectRabbitMQ = async () => {
  try {

    const connection = await amqp.connect(`${env.RABBITMQ_HOST}:${env.RABBITMQ_PORT}`)
    channel = await connection.createChannel()


    await channel.assertQueue('inventory_queue', { durable: true })

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

export const RabbitMQClient = { connectRabbitMQ, publishMessage }