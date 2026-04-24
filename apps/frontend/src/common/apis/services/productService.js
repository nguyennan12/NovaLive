import authorizedAxiosInstance from '../custom/authorizeAxios'
import { toast } from 'react-toastify'


export const addProductAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('product', data)
  toast.success(`${response.message}`)
  return response.metadata
}
export const getAllProductsAPI = async ({ page = 1, limit = 10 }) => {
  const response = await authorizedAxiosInstance.get(`product?page=${page}&limit=${limit}`)
  return response.metadata
}
export const getAllSkuAPI = async ({ page = 1, limit = 10 }) => {
  const response = await authorizedAxiosInstance.get(`product/skus?page=${page}&limit=${limit}`)
  return response.metadata
}

export const deleteProductAPI = async (productId) => {
  const response = await authorizedAxiosInstance.delete(`product/${productId}`)
  toast.success(`${response.message}`)
  return response.metadata
}

export const updateProductAPI = async (productId, data) => {
  console.log(data)
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