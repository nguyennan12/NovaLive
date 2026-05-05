import inventoryService from '#modules/inventory/services/inventory.service.js'
import orderModel from '#modules/order/models/order.model.js'
import discountService from '#modules/discount/services/discount.service.js'
import mongoose from 'mongoose'
import MyLogger from '#infrastructure/loggers/MyLogger.js'

const listenToCancelOrderQueue = async (channel) => {
  //action khi nhận massage
  const CANCEL_QUEUE = 'order_cancel_queue'
  channel.consume(CANCEL_QUEUE, async (msg) => {
    if (msg !== null) {
      const session = await mongoose.startSession()
      session.startTransaction()
      try {
        //nhận dc orderId
        const { orderId } = JSON.parse(msg.content.toString())
        MyLogger.info(`Except request cancel order: ${orderId}`, 'ORDER_WORKER')
        //tìm cái order đó thong qua orderId
        const order = await orderModel.findOne({ order_trackingNumber: orderId })
        if (!order || order.order_status !== 'pending') {
          MyLogger.info(`Order ${orderId} is processed before, skip cancel`, 'ORDER_WORKER')
          await session.abortTransaction()
          return channel.ack(msg) //nếu kh có ordeer đó thì xóa message
        }
        //nếu sau 15p mà status của order vẫn là pending thì xóa
        if (order.order_status === 'pending' && order.order_payment.paymentStatus === 'pending') {
          MyLogger.info(`Order ${orderId} expired. Cancelling order and releasing stock...`, 'ORDER_WORKER')
          await orderModel.updateOne(
            { _id: order._id },
            {
              $set: {
                order_status: 'cancelled',
                'order_payment.paymentStatus': 'failed',
                cancelledAt: new Date()
              }
            },
            { session }
          )
          //danh sách các sản phẩm bị cancel để nhả kho
          const itemsToRelease = order.order_products.map(item => ({ skuId: item.skuId, quantity: item.quantity }))
          //bắt đầu nhả kho
          try {
            await inventoryService.releaseStock(order._id, itemsToRelease, session)
            MyLogger.info(`Release stock order ${orderId} successfully! sku comback inventory.`, 'ORDER_WORKER')
          } catch {
            MyLogger.error(`Release stock order ${orderId}`, 'ORDER_WORKER')
          }
          //cancel discount đã sử dụng
          try {
            await discountService.cancelDiscountCode(order.order_appliedDiscountCodes, order.order_userId, session)
            MyLogger.info(`Cancel discountfor order ${orderId} successfully!.`, 'ORDER_WORKER')
          } catch {
            MyLogger.error(`Cancel discountfor ordere ${orderId}`, 'ORDER_WORKER')
          }

          MyLogger.info(`Cancel ordere ${orderId} successfully!`, 'ORDER_WORKER')
          await session.commitTransaction()
        } else {
          await session.abortTransaction()
          MyLogger.info(`Order ${orderId} is processed.`, 'ORDER_WORKER')
        }
        channel.ack(msg)
      }
      catch (error) {
        await session.abortTransaction()
        MyLogger.error(`Error when cancel order: ${error.message}`, 'ORDER_WORKER')
        // nack, không requeue — tránh infinite retry loop với lỗi persistent
        channel.nack(msg, false, false)
      }
      finally {
        session.endSession()
      }
    }
  })

}

export default {
  listenToCancelOrderQueue
}