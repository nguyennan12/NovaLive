import ApiError from '#core/error.response.js'
import { RabbitMQClient } from '#database/init.rabbitMQ.js'
import { validateBuyNowItems } from '#helpers/order.helper.js'
import { addressModel } from '#models/address.model.js'
import orderModel from '#models/order.model.js'
import orderRepo from '#models/repository/order.repo.js'
import { skuModel } from '#models/sku.model.js'
import converter from '#utils/converter.js'
import { generateOrderCode } from '#utils/generator.js'
import { StatusCodes } from 'http-status-codes'
import cartService from './cart.service.js'
import discountService from './discount.service.js'
import inventoryService from './inventory.service.js'
import shippingService from './shipping.service.js'
import socketService from './socket.service.js'

const checkoutReview = async ({ userId, reqBody }) => {
  const { cartId, shopOrderIds, userAddressId, productDiscountCode, shippingDiscountCode } = reqBody
  const isBuyNow = !cartId
  //kiểm tra user mua hàng trong cart hay mua trực tiếp (mua ngay)
  if (!isBuyNow) {
    await cartService.validateCartItems({ cartId, shopOrderIds })
  }
  else {
    await validateBuyNowItems({ shopOrderIds })
  }

  //duyệt order của từng shop
  const shopOrderIdsNew = await Promise.all(
    shopOrderIds.map(async (shopOrder) => {
      const { shopId, item_products, shop_discount = [] } = shopOrder
      if (!item_products || item_products.length === 0) throw new ApiError(StatusCodes.BAD_REQUEST, `Shop ${shopId} is missing products!`)
      //lấy danh sách các sku id
      const skuIds = item_products.map(item => item.skuId)

      //chọc vào Db tìm sku và price tương ứng của nó để cộng dồn giá tiến
      const skus = await skuModel.find({ _id: { $in: skuIds } }).lean()
      const skuMap = skus.reduce((dict, sku) => {
        dict[sku._id.toString()] = sku
        return dict
      }, {})
      const { rawPrice, totalWeight } = item_products.reduce((acc, product) => {
        const sku = skuMap[product.skuId]
        if (!sku) throw new ApiError(StatusCodes.BAD_REQUEST, `SKU ${product.skuId} not found`)
        acc.rawPrice += (product.quantity * sku.sku_price)
        acc.totalWeight += (product.quantity * sku.sku_weight)
        return acc
      }, { rawPrice: 0, totalWeight: 0 })
      const { feeShip } = await shippingService.calculateFee({ shopId, toAddress: userAddressId, weight: totalWeight })
      //thông tin của 1 checkout (one shop)
      const itemCheckout = {
        shopId,
        shop_discount,
        rawPrice,
        feeShip,
        discountAmountFeeShip: 0,
        feeShipApplyDiscount: feeShip,
        discountAmountProduct: 0,
        priceApplyDiscount: rawPrice,
        item_products
      }

      //nếu có discount áp dụng
      if (shop_discount.length > 0) {
        //lọc thành object discout key(target) : value(discount) chỉ lấy 1
        const discountMap = shop_discount.reduce((dict, discount) => {
          if (!dict[discount.target]) dict[discount.target] = discount
          return dict
        }, {})

        const { amountDiscountProduct, amountDiscountShipping } = await discountService.applyDiscounts({
          userId,
          productDiscountCode: discountMap['product']?.code,
          shippingDiscountCode: discountMap['freeship']?.code,
          productOrderTotal: rawPrice,
          shippingOrderTotal: feeShip,
        })

        //tính toán lại giá product và shipping
        if (amountDiscountProduct > 0) {
          itemCheckout.priceApplyDiscount -= amountDiscountProduct
          itemCheckout.discountAmountProduct = amountDiscountProduct
        }
        if (amountDiscountShipping > 0) {
          itemCheckout.feeShipApplyDiscount -= amountDiscountShipping
          itemCheckout.discountAmountFeeShip = amountDiscountShipping
        }

      }
      //trả về thông tin checkout của 1 shop
      return itemCheckout
    })
  )
  //tổng order của tất cả các shop
  const checkoutOrder = shopOrderIdsNew.reduce((acc, shop) => {
    acc.totalRawPrice += shop.rawPrice
    acc.totalShopDiscount += (shop.discountAmountProduct ?? 0) + (shop.discountAmountFeeShip ?? 0)
    acc.feeShip += (shop.feeShipApplyDiscount ?? 0)
    return acc
  }, { totalRawPrice: 0, feeShip: 0, totalShopDiscount: 0, finalCheckout: 0 })
  //tính lại giá cuối cùng của order
  checkoutOrder.finalCheckout = checkoutOrder.totalRawPrice - checkoutOrder.totalShopDiscount + checkoutOrder.feeShip
  //tính amout của discount global
  const { amountDiscountProduct, amountDiscountShipping } = await discountService.applyDiscounts({
    userId, productDiscountCode, shippingDiscountCode,
    productOrderTotal: checkoutOrder.finalCheckout,
    shippingOrderTotal: checkoutOrder.finalCheckout,
  })

  return {
    shopOrderIds,
    shopOrderIdsNew,
    checkoutOrder,
    amoutGlobalDiscountProduct: amountDiscountProduct,
    amoutGlobalDiscountShipping: amountDiscountShipping
  }
}

const orderByUser = async ({ userId, reqBody }) => {
  const { cartId, shopOrderIds, userAddressId, userPayment = 'cod', client_totalCheckout } = reqBody
  const { checkoutOrder } = await checkoutReview({ userId, reqBody: { cartId, shopOrderIds, userAddressId } })
  const userAddress = await addressModel.findOne({ _id: converter.toObjectId(userAddressId), owner_type: 'user' })
  //mếu số tiền client gửi về khác với số tiền checkout thì throw lỗi
  if (checkoutOrder.finalCheckout !== client_totalCheckout) throw new ApiError(StatusCodes.BAD_REQUEST, 'Price product is change, please check again!')

  const orderCode = generateOrderCode()
  //biến object lồng nhau thành dạng phẳng (flatMap)
  const allProducts = shopOrderIds.flatMap(shop => shop.item_products)
  //bắc đầu giữ kho từng product
  const reserveResults = await Promise.all(
    allProducts.map(async (item) => {
      const isReserved = await inventoryService.reserveStock({
        userId: userId,
        orderId: orderCode,
        items: [{ skuId: item.skuId, quantity: item.quantity }]
      })
      return { skuId: item.skuId, isSuccess: isReserved.status, quantity: item.quantity }
    })
  )
  //nếu có product nào giữ kho thất bại thì throw lỗi
  const failedItems = reserveResults.filter(result => result.isSuccess !== 'SUCCESS')
  if (failedItems.length > 0) {
    //còn những product thành công thì nhả kho ra
    const successItems = reserveResults.filter(result => result.isSuccess === 'SUCCESS')
    if (successItems.length > 0) {
      await inventoryService.releaseStock({ orderId: orderCode, items: successItems })
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, '“Sorry, some items in your cart are no longer available')
  }
  //tạo 1 order mới
  const newOrder = await orderModel.create({
    order_userId: userId,
    order_checkout: checkoutOrder,
    order_shipping: userAddress,
    order_payment: userPayment,
    order_products: allProducts,
    order_trackingNumber: orderCode
  })
  //nếu là order qua cart thì remove product khỏi cart
  if (cartId) {
    const skuIdsToRemove = allProducts.map(item => item.skuId)
    await cartService.removeFromCart({ userId: userId, reqBody: { skuIds: skuIdsToRemove } })
  }

  try {
    //gửi order vào message_queue để nó xử lý trong vòng 15p order có dc thanh toán k
    // nếu không thì hủy order và nhả kho lại
    await RabbitMQClient.sendOrderToDelayQueue(orderCode)
  } catch (error) {
    console.error('Error add queue:', error)
  }
  return newOrder
}

const getAllOrderByUser = async ({ userId, status, limit = 20, page = 1 }) => {
  const query = { order_userId: userId }
  if (status) {
    query.order_status = status
  }

  const skip = (page - 1) * limit
  return await orderModel.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
}

const getOrderDetail = async ({ orderId, userId }) => {
  const order = await orderRepo.getOrderDetail({ orderId, userId })
  if (!order) throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found')
  return order
}

const updateOrderStatusAdmin = async ({ orderId, newStatus }) => {
  const order = await orderModel.findOne({ order_trackingNumber: orderId }).lean()
  if (!order) throw new ApiError(StatusCodes.BAD_REQUEST, 'Order not found')

  const currentStatus = order.order_status

  if (['delivered', 'cancelled'].includes(currentStatus)) throw new ApiError(StatusCodes.BAD_REQUEST, `Order is '${currentStatus}', Do not change!`)
  const validTransitions = {
    'pending': [],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'cancelled']
  }
  const allowedNextStatuses = validTransitions[currentStatus] || []
  if (!allowedNextStatuses.includes(newStatus)) throw new BadRequestError(`Do not change status from '${currentStatus}' to '${newStatus}'`)
  const result = await orderRepo.changeStatusOrder({ orderId: orderId, statusOrder: newStatus })
  if (result) {
    const userId = result.order_userId.toString()
    const message =
      newStatus === 'shipped'
        ? `Your order ${orderId} is on the way!`
        : newStatus === 'delivered'
          ? `Your order ${orderId} has been delivered successfully!`
          : `Your order ${orderId} status has been updated to: ${newStatus}`
    socketService.sendNotificationToUser(userId, { message, orderId, newStatus })
  }
  return result
}
export default {
  checkoutReview,
  orderByUser,
  getAllOrderByUser,
  getOrderDetail,
  updateOrderStatusAdmin
}