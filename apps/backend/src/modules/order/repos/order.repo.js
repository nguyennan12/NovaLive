import orderModel from '#modules/order/models/order.model.js'

const changeStatusOrder = async ({ orderId, statusOrder = '', statusPayment = '' }) => {
  const update = {}
  if (statusOrder) update.order_status = statusOrder
  if (statusPayment) update['order_payment.paymentStatus'] = statusPayment
  if (statusOrder === 'delivered') update.deliveredAt = new Date()
  if (statusOrder === 'cancelled') update.cancelledAt = new Date()
  return await orderModel.findOneAndUpdate(
    { order_trackingNumber: orderId },
    update,
    { returnDocument: 'after' }
  )
}

const getOrderDetail = async ({ orderId, userId }) => {
  return await orderModel.findOne({
    _id: orderId,
    order_userId: userId
  })
    .populate({
      path: 'order_products.productId',
      select: 'spu_name spu_thumb spu_price spu_shopId spu_code',
      populate: { path: 'spu_shopId', select: 'shop_name' }
    })
    .lean()
}


export default {
  changeStatusOrder,
  getOrderDetail
}