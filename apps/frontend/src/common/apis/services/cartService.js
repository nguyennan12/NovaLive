import authorizedAxiosInstance from '../custom/authorizeAxios'

export const getCartAPI = async () => {
  const response = await authorizedAxiosInstance.get('cart')
  return response.metadata
}

export const addToCartAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('cart', data)
  return response.metadata
}

export const updateCartItemAPI = async ({ skuId, quantity, old_quantity }) => {
  const response = await authorizedAxiosInstance.patch('cart', { skuId, quantity, old_quantity })
  return response.metadata
}

export const removeFromCartAPI = async ({ skuIds }) => {
  const response = await authorizedAxiosInstance.delete('cart', { data: { skuIds } })
  return response.metadata
}

export const validateVoucherAPI = async (code) => {
  const response = await authorizedAxiosInstance.get(`discount?scope=global&code=${encodeURIComponent(code)}`)
  return response.metadata
}
