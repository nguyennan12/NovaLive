import authorizedAxiosInstance from '../custom/authorizeAxios'

export const checkoutAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('order/checkout', data)
  return response.metadata
}
export const OrderByUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('order', data)
  return response.metadata
}