import authorizedAxiosInstance from '../custom/authorizeAxios'

export const getInfoShopAPI = async (shopId) => {
  const response = await authorizedAxiosInstance.get(`shop/${shopId}`)
  return response.metadata
}