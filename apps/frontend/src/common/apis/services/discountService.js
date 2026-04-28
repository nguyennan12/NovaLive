import authorizedAxiosInstance from '../custom/authorizeAxios'

const toQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (key === 'limit') {
      const numericLimit = Number(value)
      if (Number.isFinite(numericLimit)) {
        const safeLimit = Math.max(1, Math.min(100, Math.trunc(numericLimit)))
        searchParams.set(key, String(safeLimit))
        return
      }
    }

    searchParams.set(key, String(value))
  })

  return searchParams.toString()
}

export const getAllDiscountAPI = async (params = {}) => {
  const query = toQueryString(params)
  const response = await authorizedAxiosInstance.get(`discount${query ? `?${query}` : ''}`)
  return response.metadata
}

export const queryDiscountAPI = async (params = {}) => {
  const query = toQueryString(params)
  const response = await authorizedAxiosInstance.get(`discount/query${query ? `?${query}` : ''}`)
  return response.metadata
}

export const createDiscountAPI = async (payload) => {
  const response = await authorizedAxiosInstance.post('discount', payload)
  return response.metadata
}

export const updateDiscountAPI = async (discountCode, payload) => {
  const response = await authorizedAxiosInstance.patch(`discount/${discountCode}`, payload)
  return response.metadata
}

export const deleteDiscountAPI = async (discountCode) => {
  const response = await authorizedAxiosInstance.delete(`discount/${discountCode}`)
  return response.metadata
}