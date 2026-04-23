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

export const deleteProductAPI = async (productId) => {
  const response = await authorizedAxiosInstance.delete(`product/${productId}`)
  return response.metadata
}

export const updateProductAPI = async (data) => {
  const response = await authorizedAxiosInstance.patch('product', data)
  return response.metadata
}

export const getProductDetailAPI = async (productId) => {
  const response = await authorizedAxiosInstance.get(`product/${productId}`)
  return response.metadata
}