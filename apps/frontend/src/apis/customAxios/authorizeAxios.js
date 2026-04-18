import axios from 'axios'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '../services/userService'
import { logoutUserAPI } from '~/redux/user/userSlice'

let axiosReduxStore
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}

const authorizedAxiosInstance = axios.create({
  baseURL: '/v1/api',
  timeout: 1000 * 60 * 10,
  withCredentials: true
})

authorizedAxiosInstance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})


let refreshTokenPromise = null

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      if (axiosReduxStore) {
        axiosReduxStore.dispatch(logoutUserAPI(false))
      }
    }
    const originalRequests = error.config
    if (error.response?.status === 410 && !originalRequests._retry) {
      originalRequests._retry = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            return data?.accessToken
          })
          .catch((_error) => {
            if (axiosReduxStore) {
              axiosReduxStore.dispatch(logoutUserAPI(false))
            }
            return Promise.reject(_error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }
      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequests)
      })
    }
    if (error.response?.status !== 410) {
      let errorMessage = error?.message
      if (error.response?.data?.message) {
        errorMessage = error.response?.data?.message
      }
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance