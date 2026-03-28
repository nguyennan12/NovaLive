import productRepo from '#models/repository/product.repo.js'

const removeUndefinedObject = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key]
    }
  })
  return obj
}

const flattenObject = obj => {
  const final = {}
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const response = flattenObject(obj[key])
      Object.keys(response).forEach(childKey => {
        final[`${key}.${childKey}`] = response[childKey]
      })

    } else {
      final[key] = obj[key]
    }
  })
  return final
}

const updateSubModel = async (model, productId, payload) => {
  const cleanData = removeUndefinedObject(payload)
  if (cleanData.product_attributes) {
    await productRepo.updateProductById({
      productId,
      payload: flattenObject(removeUndefinedObject(cleanData.product_attributes)),
      model
    })
  }
  return flattenObject(cleanData)
}

export default updateSubModel