import authorizedAxiosInstance from '../custom/authorizeAxios'
import { toast } from 'react-toastify'

export const addInventoryAPI = async (data) => {
    const res = await authorizedAxiosInstance.post('inventory', data)
    toast.success(`${res.message}`)
    return res.metadata
}