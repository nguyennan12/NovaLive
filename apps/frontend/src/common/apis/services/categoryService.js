import authorizedAxiosInstance from '../custom/authorizeAxios'

export const createCategoryAPI = async (data) => {
  const res = await authorizedAxiosInstance.post('category', data)
  return res.metadata
}

export const createCategoryBulkAPI = async (data) => {
  const res = await authorizedAxiosInstance.post('category/bulk', data)
  return res.metadata
}

export const getAllCategoryAPI = async (params = {}) => {
  const res = await authorizedAxiosInstance.get('category', { params })
  return res.metadata
}

export const getAttributeByCategorySlugAPI = async (slugArr = []) => {
  const slug = Array.isArray(slugArr) ? slugArr.join(',') : slugArr
  const res = await authorizedAxiosInstance.get('category/attribute', { params: { slug } })
  return res.metadata
}

export const addAttributeToCategoryAPI = async ({ categoryId, data }) => {
  const res = await authorizedAxiosInstance.post(`category/${categoryId}/attribute`, data)
  return res.metadata
}