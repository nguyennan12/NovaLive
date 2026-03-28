import * as Models from '#models/product.model.js'
import updateSubModel from '#helpers/object.helper.js'
import productRepo from '#models/repository/product.repo.js'

export class Product {
  constructor({
    product_name, product_thumb, product_description, product_price,
    product_quantity, product_type, product_attributes, product_shopId }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_attributes = product_attributes
    this.product_shopId = product_shopId
  }
  async createProduct(productId) {
    const newProduct = await Models.ProductModel.create({ ...this, _id: productId })
    //xu ly them vao inventory
    //...
    if (!newProduct) throw new ApiError(StatusCodes.BAD_REQUEST, 'create new product error')
    return newProduct
  }
  async updateProduct(productId, reqBody) {
    return await productRepo.updateProductById({ productId, reqBody, model: Models.ProductModel })
  }
}

class BaseSubProduct extends Product {
  constructor(reqBody, model) {
    super(reqBody)
    this.model = model
  }

  async createProduct() {
    const newSubProduct = await this.model.create({
      ...this.product_attributes,
      product_shopId: this.product_shopId
    })
    return await super.createProduct(newSubProduct._id)
  }

  async updateProduct(productId) {
    const reqBody = await updateSubModel(this.model, productId, this)
    return super.updateProduct(productId, reqBody)
  }
}

export class Clothing extends BaseSubProduct {
  constructor(reqBody) { super(reqBody, Models.ClothingtModel) }
}

export class Electronic extends BaseSubProduct {
  constructor(reqBody) { super(reqBody, Models.ElectronicModel) }
}

export class Furniture extends BaseSubProduct {
  constructor(reqBody) { super(reqBody, Models.FurnitureModel) }
}

export class Cosmetics extends BaseSubProduct {
  constructor(reqBody) { super(reqBody, Models.CosmeticsModel) }
}

export class Food extends BaseSubProduct {
  constructor(reqBody) { super(reqBody, Models.FoodModel) }
}

export class Book extends BaseSubProduct {
  constructor(reqBody) { super(reqBody, Models.BookModel) }
}