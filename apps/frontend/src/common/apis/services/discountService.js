import authorizedAxiosInstance from '../custom/authorizeAxios'
import { toQueryString } from '~/common/utils/converter'

export const getAllDiscountAPI = async (params = {}) => {
  const query = toQueryString(params)
  const response = await authorizedAxiosInstance.get(`discount${query ? `?${query}` : ''}`)
  return response.metadata
}
export const getAllDiscountOfShopAPI = async (shopId, params) => {
  const query = toQueryString(params)
  const response = await authorizedAxiosInstance.get(`discount/shop/${shopId}?${query}`)
  return response.metadata
}

export const queryDiscountAPI = async (params = {}) => {
  const query = toQueryString(params)
  const response = await authorizedAxiosInstance.get(`discount/query${query ? `?${query}` : ''}`)
  return response.metadata
}

export const createDiscountAPI = async (payload) => {
  const response = await authorizedAxiosInstance.post('discount', payload)
  return response.metadata
}

export const updateDiscountAPI = async (discountCode, payload) => {
  const response = await authorizedAxiosInstance.patch(`discount/${discountCode}`, payload)
  return response.metadata
}

export const deleteDiscountAPI = async (discountCode) => {
  const response = await authorizedAxiosInstance.delete(`discount/${discountCode}`)
  return response.metadata
}