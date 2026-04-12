import orderModel from '#models/order.model.js'

const changeStatusOrder = async ({ orderId, statusOrder = '', statusPayment = '' }) => {
  return await orderModel.updateOne(
    { order_trackingNumber: orderId },
    {
      'order_payment.paymentStatus': statusPayment,
      order_status: statusOrder
    }
  )
}

const getOrderDetail = async ({ orderId, userId }) => {
  return await orderModel.findOne({
    order_trackingNumber: orderId,
    order_userId: userId
  })
    .populate({
      path: 'order_products.productId',
      select: 'spu_name spu_thumb spu_price'
    })
    .lean()
}

export default {
  changeStatusOrder,
  getOrderDetail
}