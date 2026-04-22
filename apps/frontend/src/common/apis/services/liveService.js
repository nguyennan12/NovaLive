import authorizedAxiosInstance from '~/common/apis/custom/authorizeAxios'

export const joinLiveAPI = async (liveId) => {
  const response = await authorizedAxiosInstance.post(`livestream/${liveId}/join`)
  return response.metadata
}
export const startLiveAPI = async (liveId) => {
  const response = await authorizedAxiosInstance.post(`livestream/${liveId}/start`)
  return response.metadata
}
export const endLiveAPI = async (liveId) => {
  const response = await authorizedAxiosInstance.post(`livestream/${liveId}/end`)
  return response.metadata
}
export const createLiveSessionAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('livestream', data)
  return response.metadata
}
export const getActiveSessionsAPI = async (params) => {
  const response = await authorizedAxiosInstance.get('livestream/active', { params })
  return response.metadata
}