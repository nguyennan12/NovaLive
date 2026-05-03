// authorizeAxios.js — import store thẳng, không cần injectStore
import axios from 'axios'
import { clearCurrentUser } from '~/store/user/userSlice'
import { store } from '~/store/store'

const authorizedAxiosInstance = axios.create({
  baseURL: '/v1/api',
  timeout: 1000 * 60 * 10,
  withCredentials: true
})

authorizedAxiosInstance.interceptors.request.use((config) => {
  const user = store.getState()?.user?.currentUser
  if (user) {
    config.headers['x-client-id'] = user._id
    config.headers['Authorization'] = `Bearer ${user.accessToken}`
  }
  return config
}, (error) => Promise.reject(error))

let refreshTokenPromise = null

authorizedAxiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearCurrentUser())
      window.location.href = '/login'
      return Promise.reject(error)
    }

    const originalRequests = error.config
    if (error.response?.status === 410 && !originalRequests._retry) {
      originalRequests._retry = true
      if (!refreshTokenPromise) {
        refreshTokenPromise = import('~/common/apis/services/userService')
          .then(({ refreshTokenAPI }) => refreshTokenAPI())
          .catch((_error) => {
            store.dispatch(clearCurrentUser())
            window.location.href = '/login'
            return Promise.reject(_error)
          })
          .finally(() => { refreshTokenPromise = null })
      }
      return refreshTokenPromise.then(() => authorizedAxiosInstance(originalRequests))
    }

    // if (error.response?.status !== 410) {
    //   toast.error(error.response?.data?.message || error?.message)
    // }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance