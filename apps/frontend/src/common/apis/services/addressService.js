import authorizedAxiosInstance from '../custom/authorizeAxios'

export const getUserAddressAPI = async (addressId) => {
  const response = await authorizedAxiosInstance.get(`address/${addressId}`)
  return response.metadata
}
export const getAllUserAddressAPI = async (ownerType) => {
  const response = await authorizedAxiosInstance.get(`address?owner_type=${ownerType}`)
  return response.metadata
}
export const createAddressAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('address', data)
  return response.metadata
}