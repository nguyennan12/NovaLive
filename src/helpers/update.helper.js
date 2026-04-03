/* eslint-disable indent */
export const removeUndefinedObject = obj => {
  if (typeof obj !== 'object' || obj === null) return obj

  Object.keys(obj).forEach(key => {
    const value = obj[key]

    if (value === null || value === undefined) {
      delete obj[key]
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      obj[key] = removeUndefinedObject(value)

      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      }
    }
  })

  return obj
}
export const flattenObject = (obj, parentKey = '', result = {}) => {
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    const newKey = parentKey ? `${parentKey}.${key}` : key

    if (value === null || value === undefined) return

    if (Array.isArray(value) || value instanceof Date) {
      result[newKey] = value
      return
    }

    if (typeof value === 'object') {
      flattenObject(value, newKey, result)
    } else {
      result[newKey] = value
    }
  })

  return result
}
export const updateSubModel = async ({
  model,
  id,
  payload,
  allowedFields = []
}) => {
  let data = payload
  if (allowedFields.length) {
    data = Object.keys(payload)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = payload[key]
        return obj
      }, {})
  }
  const cleanData = removeUndefinedObject(data)
  const updateData = flattenObject(cleanData)
  return await model.findOneAndUpdate(
    { _id: id },
    { $set: updateData },
    { returnDocument: 'after' }
  )
}

export const mergeGrants = (current = [], incoming = []) => {
  const map = new Map()

    ;[...current, ...incoming].forEach(({ resourceId, actions }) => {
      if (!map.has(resourceId)) {
        map.set(resourceId, new Set(actions))
      } else {
        actions.forEach(a => map.get(resourceId).add(a))
      }
    })

  return Array.from(map, ([resourceId, actions]) => ({
    resourceId,
    actions: [...actions]
  }))
}