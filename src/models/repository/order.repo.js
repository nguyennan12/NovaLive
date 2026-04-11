import orderModel from '#models/order.model.js'

const changeStatusOrder = async ({ orderId, statusOrder = '', statusPayment = '' }) => {
  console.log('🚀 ~ changeStatusOrder ~ statusOrder:', statusOrder)
  console.log('🚀 ~ changeStatusOrder ~ orderId:', orderId)
  return await orderModel.updateOne(
    { order_trackingNumber: orderId },
    {
      'order_payment.paymentStatus': statusPayment,
      order_status: statusOrder
    }
  )
}

export default {
  changeStatusOrder
}