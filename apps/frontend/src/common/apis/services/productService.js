import authorizedAxiosInstance from '../custom/authorizeAxios'
import { toast } from 'react-toastify'
import { toQueryString } from '~/common/utils/converter'


export const addProductAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('product', data)
  toast.success(`${response.message}`)
  return response.metadata
}
export const getAllProductsAPI = async ({ page = 1, limit = 10, shopId } = {}) => {
  const query = toQueryString({ page, limit, ...(shopId && { shopId }) })
  const response = await authorizedAxiosInstance.get(`product?${query}`)
  return response.metadata
}
export const getAllProductWithStockAPI = async (query) => {
  const response = await authorizedAxiosInstance.get(`product/skus?${query}`)
  return response.metadata
}

export const deleteProductAPI = async (productId) => {
  const response = await authorizedAxiosInstance.delete(`product/${productId}`)
  toast.success(`${response.message}`)
  return response.metadata
}

export const updateProductAPI = async (productId, data) => {
  const response = await authorizedAxiosInstance.patch(`product/${productId}`, data)
  toast.success(`${response.message}`)
  return response.metadata
}

export const getProductDetailAPI = async (productId) => {
  const response = await authorizedAxiosInstance.get(`product/${productId}`)
  return response.metadata
}

export const queryProductAPI = async (query) => {
  const response = await authorizedAxiosInstance.get(`product/search?${query}`)
  return response.metadata
}

export const getProductStatsAPI = async () => {
  const response = await authorizedAxiosInstance.get('product/stats')
  return response.metadata
}

export const getOneSkusAPI = async (spuId, skuId) => {
  const response = await authorizedAxiosInstance.get(`product/variation?spuId=${spuId}&skuId=${skuId}`)
  return response.metadata
}