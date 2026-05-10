import authorizedAxiosInstance from '../custom/authorizeAxios'
import { toast } from 'react-toastify'

export const getMyProfileAPI = async () => {
  const response = await authorizedAxiosInstance.get('user/me')
  return response.metadata
}

export const updateMyProfileAPI = async (data) => {
  const response = await authorizedAxiosInstance.patch('user/me', data)
  return response.metadata
}

export const changePasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.patch('access/change-password', data)
  return response.metadata
}

export const logoutAllDevicesAPI = async () => {
  const response = await authorizedAxiosInstance.post('access/logout-all')
  return response.metadata
}

export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('access/signup', data)
  toast.success('Account created successfully! Please check and verify your account before logging in', { theme: 'colored' })
  return response
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('access/verify', data)
  toast.success('Account verified successfully! Now you can login to enjoy our services!', { theme: 'colored' })
  return response
}

export const resendMailAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('access/sendmail', data)
  return response
}

export const loginAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('access/login', data)
  return response
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.post('access/refreshtoken')
  return response
}