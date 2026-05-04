import inventoryService from '#modules/inventory/services/inventory.service.js'
import orderModel from '#modules/order/models/order.model.js'
import discountService from '#modules/discount/services/discount.service.js'
import mongoose from 'mongoose'

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
        console.log(`[DLX] Except request cancel order: ${orderId}`)
        //tìm cái order đó thong qua orderId
        const order = await orderModel.findOne({ order_trackingNumber: orderId })
        if (!order || order.order_status !== 'pending') {
          console.log(`[DLX] Order ${orderId} is processed before, skip cancel`)
          await session.abortTransaction()
          return channel.ack(msg) //nếu kh có ordeer đó thì xóa message
        }
        //nếu sau 15p mà status của order vẫn là pending thì xóa
        if (order.order_status === 'pending' && order.order_payment.paymentStatus === 'pending') {
          console.log(`[DLX] Order ${orderId} expired. Cancelling order and releasing stock...`)
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
          await inventoryService.releaseStock(order._id, itemsToRelease, session)
          //cancel discount đã sử dụng
          await discountService.cancelDiscountCode(order.order_appliedDiscountCodes, order.order_userId, session)
          console.log(`[DLX] Cancel ordere ${orderId} successfully! sku comback inventory.`)
          await session.commitTransaction()
        } else {
          await session.abortTransaction()
          console.log(`[DLX] Order ${orderId} is processed.`)
        }
        channel.ack(msg)
      }
      catch (error) {
        await session.abortTransaction()
        console.error('[DLX] Error when cancel order:', error)
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