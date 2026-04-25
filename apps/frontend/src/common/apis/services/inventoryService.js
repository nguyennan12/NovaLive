import authorizedAxiosInstance from '../custom/authorizeAxios'

export const addInventoryAPI = async (data) => {
  const res = await authorizedAxiosInstance.post('inventory', data)
  return res.metadata
}