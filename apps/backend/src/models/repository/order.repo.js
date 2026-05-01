import orderModel from '#models/order.model.js'

const changeStatusOrder = async ({ orderId, statusOrder = '', statusPayment = '' }) => {
  const update = {}
  if (statusOrder) update.order_status = statusOrder
  if (statusPayment) update['order_payment.paymentStatus'] = statusPayment
  return await orderModel.findOneAndUpdate(
    { order_trackingNumber: orderId },
    update,
    { returnDocument: 'after' }
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