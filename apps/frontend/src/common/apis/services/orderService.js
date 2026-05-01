import authorizedAxiosInstance from '../custom/authorizeAxios'

export const checkoutAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('order/checkout', data)
  return response.metadata
}