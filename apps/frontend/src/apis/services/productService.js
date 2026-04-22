import authorizedAxiosInstance from '../custom/authorizeAxios'
import { toast } from 'react-toastify'


export const addProductAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('product', data)
  toast.success(`${response.message}`)
  return response.metadata
}