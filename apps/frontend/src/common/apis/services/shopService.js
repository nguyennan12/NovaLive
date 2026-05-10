import authorizedAxiosInstance from '../custom/authorizeAxios'

export const getInfoShopAPI = async (shopId) => {
  const response = await authorizedAxiosInstance.get(`shop/${shopId}`)
  return response.metadata
}

export const getShopByUserAPI = async () => {
  const response = await authorizedAxiosInstance.get('shop')
  return response.metadata
}

export const registerShopAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('shop/register', data)
  return response.metadata
}

export const updateShopAPI = async ({ shopId, data }) => {
  const response = await authorizedAxiosInstance.patch(`shop/${shopId}`, data)
  return response.metadata
}