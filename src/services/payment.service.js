import crypto from 'crypto'
import qs from 'qs'
import moment from 'moment'
import { env } from '#config/environment.config.js'
import { sortObject } from '#helpers/object.helper.js'

const createPaymentUrl = async ({ reqBody }) => {
  const { orderId, amount, ipAddr, bankCode, language } = reqBody
  const tmnCode = env.VNP_TMN_CODE
  const secretKey = env.VNP_HASH_SECRET
  let vnpUrl = env.VNP_URL
  const returnUrl = env.VNP_RETURN_URL

  //lấy ip của user hiện tại gáng mặc định
  // let ipAddr = req.headers['x-forwarded-for'] ||
  //   req.connection.remoteAddress ||
  //   req.socket.remoteAddress ||
  //   req.connection.socket.remoteAddress

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

export default {
  createPaymentUrl
}