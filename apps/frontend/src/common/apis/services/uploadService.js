import authorizedAxiosInstance from '../custom/authorizeAxios'

export const uploadSingleImageAPI = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await authorizedAxiosInstance.post('upload/product/thumb', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return res.metadata
}

export const uploadAvatarAPI = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await authorizedAxiosInstance.post('upload/user/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.metadata
}