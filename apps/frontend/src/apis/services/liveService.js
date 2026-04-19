import authorizedAxiosInstance from '~/apis/customAxios/authorizeAxios'

export const joinLiveAPI = async (liveId) => {
  const response = await authorizedAxiosInstance.post(`livestream/${liveId}/join`)
  return response.metadata
}

export const getActiveSessionsAPI = async (params) => {
  const response = await authorizedAxiosInstance.get('livestream/active', { params })
  return response.metadata
}