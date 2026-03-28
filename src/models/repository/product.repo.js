

const updateProductById = async ({ productId, reqBody, model }) => {
  return await model.findByIdAndUpdate(productId, reqBody, { returnDocument: 'after' }).lean()
}

export default {
  updateProductById
}