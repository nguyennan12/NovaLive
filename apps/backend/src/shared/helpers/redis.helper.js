/**
 * @param {Array} keys - Danh sách các id/slug cần lấy
 * @param {Function} fetchFn - Hàm lấy dữ liệu từ DB nếu cache miss
 * @param {String} cachePrefix - Tiền tố cache (vd: 'user', 'product')
 * @param {String} identifier - Trường dùng để định danh trong object (vd: 'attr_id', '_id')
 */
import { redisClient } from '#infrastructure/database/init.redis.js'

export const getOrSetCache = async (keys, fetchFn, cachePrefix, identifier = 'id', ttl = 3600) => {
  if (!keys.length) return []

  // 1. MGET lấy nhanh toàn bộ
  const cacheKeys = keys.map(k => `${cachePrefix}:${k}`)
  const cachedData = await redisClient.mGet(cacheKeys)

  //result lưu data json của 1 đối tượng đang xét theo (keys)
  const result = cachedData.map(d => d ? JSON.parse(d) : null)
  const missingKeys = keys.filter((_, i) => !result[i])//lưu lại key bị thiếu

  if (missingKeys.length > 0) {
    //láy tất cả data có key bị thiếu
    const freshData = await fetchFn(missingKeys)

    const multi = redisClient.multi()//multi tối ưu lưu nhiều key vào redis

    freshData.forEach(item => {
      const keyVal = item[identifier] //lấy 1 field của object (field ở đay là identifier do truyền vào)
      multi.set(`${cachePrefix}:${keyVal}`, JSON.stringify(item), 'EX', ttl)

      //tìm vì trị có keyVal tức là giá trị trong keys mà đã bỏ qua và gáng lại
      const idx = keys.indexOf(keyVal.toString())
      if (idx > -1) result[idx] = item
    })
    await multi.exec()
  }
  return result.filter(Boolean)
}