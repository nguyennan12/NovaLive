import authorizedAxiosInstance from '../custom/authorizeAxios'

export const getActiveCampaignAPI = async () => {
  const response = await authorizedAxiosInstance.get('flash-sale/active')
  return response.metadata
}

export const getFlashSaleItemsAPI = async (campaignId) => {
  const response = await authorizedAxiosInstance.get(`flash-sale/items/${campaignId}`)
  return response.metadata
}
