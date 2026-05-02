import authorizedAxiosInstance from '../custom/authorizeAxios'

export const checkoutAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('order/checkout', data)
  return response.metadata
}
export const OrderByUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('order', data)
  return response.metadata
}
export const createVNPayUrlAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('payment/create_url', data)
  return response.metadata
}
export const confirmCodOTPAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('payment/cod', data)
  return response.metadata
}
export const resendCodOTPAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('access/sendmail', data)
  return response.metadata
}
export const verifyVNPayReturnAPI = async (params) => {
  const response = await authorizedAxiosInstance.get('payment/vnpay_return', { params })
  return response.metadata
}