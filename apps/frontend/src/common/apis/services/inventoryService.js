import authorizedAxiosInstance from '../custom/authorizeAxios'

export const addInventoryAPI = async (data) => {
  const res = await authorizedAxiosInstance.post('inventory', data)
  return res.metadata
}
export const getHistoryInventoryAPI = async (query) => {
  const res = await authorizedAxiosInstance.get(`inventory/history?${query}`)
  return res.metadata
}
export const getChartArtInventoryAPI = async (period) => {
  const res = await authorizedAxiosInstance.get(`inventory/chart?period=${period}`)
  return res.metadata
}