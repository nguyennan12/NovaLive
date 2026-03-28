import * as ProductTypes from '#config/products.config.js'
import ApiError from '#core/error.response.js'
import { ProductModel } from '#models/product.model.js'
import productRepo from '#models/repository/product.repo.js'
import converter from '#utils/converter.js'
import { StatusCodes } from 'http-status-codes'


class ProductFactory {
  static productRegistry = ProductTypes //lưu type: class.model

  // === Create Product (Shop)===
  static createProduct(type, reqBody) {
    const productClass = this.productRegistry[type]
    if (!productClass) throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid Type: ${type}`)
    return new productClass(reqBody).createProduct()
  }

  // === Update Product (Shop)===
  static async updateProduct(productId, reqBody) {
    const foundProduct = await ProductModel.findById(productId)
    if (!foundProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'Product does not exists!')
    const ProductClass = this.productRegistry[foundProduct.product_type]
    return new ProductClass(reqBody).updateProduct(productId)
  }

  // === Publish Product =(Shop)==
  static async publishProduct({ productId, shopId }) {
    return await productRepo.changePublishStatus({
      productId,
      shopId,
      isPublished: true
    })
  }

  // === unPublish Product (Shop)===
  static async unPublishProduct({ productId, shopId }) {
    return await productRepo.changePublishStatus({
      productId,
      shopId,
      isPublished: false
    })
  }

  // === get list published Product (Shop)===
  static async getPublishedProduct({ shopId, limit = 50, page = 1 }) {
    const filter = {
      product_shopId: converter.toObjectId(shopId),
      isPublished: true
    }
    return await productRepo.findAllProducts({ limit, page, filter })
  }

  // === get list Draft Product (Shop)===
  static async getDraftProduct({ shopId, limit = 50, page = 1 }) {
    const filter = {
      product_shopId: converter.toObjectId(shopId),
      isDraft: true
    }
    return await productRepo.findAllProducts({ limit, page, filter })
  }

  // === get list Product (User)===
  static async getAllProducts({ limit = 50, sort = 'ctime', page = 1 }) {
    const filter = { isPublished: true }
    const select = ['product_name', 'product_price', 'product_thumb']
    return await productRepo.findAllProducts({ limit, sort, page, filter, select })
  }

  static async getProductDetail({ productId }) {
    return await productRepo.getProductDetail(productId)
  }

  static async searchProduct({ keySearch }) {
    return await productRepo.searchProducts({ keySearch })
  }
}

export default ProductFactory