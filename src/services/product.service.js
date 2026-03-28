import * as ProductTypes from '#config/products.config.js'
import ApiError from '#core/error.response.js'
import { ProductModel } from '#models/product.model.js'


class ProductFactory {
  static productRegistry = ProductTypes //lưu type: class.model

  static createProduct(type, reqBody) {
    const productClass = this.productRegistry[type]
    if (!productClass) throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid Type: ${type}`)
    return new productClass(reqBody).createProduct()
  }

  static async updateProduct(productId, reqBody) {
    const foundProduct = await ProductModel.findById(productId)
    if (!foundProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'Product does not exists!')
    const ProductClass = this.productRegistry[foundProduct.product_type]
    return new ProductClass(reqBody).updateProduct(productId)
  }

  //=== bussines service ====
}

export default ProductFactory