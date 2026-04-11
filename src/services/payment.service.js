/* eslint-disable indent */
import crypto from 'crypto'
import qs from 'qs'
import moment from 'moment'
import { env } from '#config/environment.config.js'
import { sortObject } from '#helpers/object.helper.js'
import orderModel from '#models/order.model.js'
import inventoryService from './inventory.service.js'
import orderRepo from '#models/repository/order.repo.js'

const createPaymentUrl = async ({ reqBody, ipAddr }) => {
  const { orderId, amount, bankCode, language } = reqBody
  const tmnCode = env.VNP_TMN_CODE
  const secretKey = env.VNP_HASH_SECRET
  let vnpUrl = env.VNP_URL
  const returnUrl = env.VNP_RETURN_URL

  // chuẩn VNPAY (YYYYMMDDHHmmss) ngày tạo và hạn giao dịch
  const createDate = moment().utcOffset('+07:00').format('YYYYMMDDHHmmss')
  const expireDate = moment().utcOffset('+07:00').add(15, 'minutes').format('YYYYMMDDHHmmss')

  const locale = (language === null || language === '' || language === undefined) ? 'vn' : language
  let currCode = 'VND'
  //Khởi tạo Object tham số
  let vnp_Params = {}
  vnp_Params['vnp_Version'] = '2.1.0'
  vnp_Params['vnp_Command'] = 'pay'
  vnp_Params['vnp_TmnCode'] = tmnCode
  vnp_Params['vnp_Locale'] = locale
  vnp_Params['vnp_CurrCode'] = currCode
  vnp_Params['vnp_TxnRef'] = orderId // Mã đơn hàng của bạn
  vnp_Params['vnp_OrderInfo'] = `Thanh toan cho don hang ${orderId}`
  vnp_Params['vnp_OrderType'] = 'other'
  vnp_Params['vnp_Amount'] = amount * 100 // VNPAY bắt buộc nhân 100
  vnp_Params['vnp_ReturnUrl'] = returnUrl
  vnp_Params['vnp_IpAddr'] = ipAddr
  vnp_Params['vnp_CreateDate'] = createDate
  vnp_Params['vnp_ExpireDate'] = expireDate
  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode
  }
  //Sắp xếp Object
  vnp_Params = sortObject(vnp_Params)

  //Băm dữ liệu (Tạo chữ ký bảo mật - Hash)
  const signData = qs.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  //Gắn chữ ký vào cuối URL
  vnp_Params['vnp_SecureHash'] = signed
  vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false })

  // Trả link
  return { paymentUrl: vnpUrl }
}

const vnpayIpn = async (vnp_Params) => {
  const secureHash = vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHashType']

  vnp_Params = sortObject(vnp_Params)
  const secretKey = env.VNP_HASH_SECRET
  const signData = qs.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  if (secureHash === signed) {
    const orderId = vnp_Params['vnp_TxnRef']
    const rspCode = vnp_Params['vnp_ResponseCode']
    const vnpAmount = vnp_Params['vnp_Amount'] / 100

    const order = await orderModel.findOne({ order_trackingNumber: orderId })
    if (!order) return { RspCode: '01', Message: 'Order not found' }
    if (order.order_checkout.finalCheckout !== vnpAmount) return { RspCode: '04', Message: 'Invalid amount' }
    if (order.order_payment.paymentStatus !== 'pending') return { RspCode: '02', Message: 'Order already confirmed' }

    const items = order.order_products.map(item => ({ skuId: item.skuId, quantity: item.quantity }))
    if (rspCode === '00') {
      await Promise.all([
        orderRepo.changeStatusOrder({ orderId: orderId, statusOrder: 'processing', statusPayment: 'paid' }),
        inventoryService.confirmDeductStock(orderId, items)
      ])
      console.log(`[VNPAY] Đơn ${orderId} thanh toán THÀNH CÔNG. Đã trừ kho!`)
    } else {
      await Promise.all([
        orderRepo.changeStatusOrder({ orderId: orderId, statusOrder: 'cancelled', statusPayment: 'failed' }),
        inventoryService.releaseStock(orderId, items)
      ])
      console.log(`[VNPAY] Đơn ${orderId} thanh toán THẤT BẠI. Đã nhả kho!`)
    }
    return { RspCode: '00', Message: 'Confirm Success' }
  } else {
    return { RspCode: '97', Message: 'Fail checksum' }
  }
}

const vnpayReturn = async (vnp_Params) => {
  const secureHash = vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHashType']

  vnp_Params = sortObject(vnp_Params)
  const secretKey = env.VNP_HASH_SECRET
  const signData = qs.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
  if (signed === secureHash) {
    const code = vnp_Params['vnp_ResponseCode']
    if (code === '00') {
      return { code: '00', message: 'Giao dịch thành công' }
    } else {
      return { code: code, message: 'Giao dịch thất bại' }
    }
  } else {
    return { code: '97', message: 'Chữ ký không hợp lệ' }
  }
}

export default {
  createPaymentUrl,
  vnpayIpn,
  vnpayReturn
}