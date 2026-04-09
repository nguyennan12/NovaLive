import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'
import inventoryService from './inventory.service.js'
import cartModel from '#models/cart.model.js'
import { generateCatId } from '#utils/generator.js'

const addToCart = async ({ userId, reqBody }) => {
  const { skuId, quantity, } = reqBody
  const available = await inventoryService.checkAvailableStock({ skuId, quantity })
  if (!available) throw new ApiError(StatusCodes.BAD_REQUEST, 'Stock is not enough')
  const cartQuery = { cart_userId: userId, cart_state: 'active' }
  const foundCart = await cartModel.findOne(cartQuery)
  if (!foundCart) {
    return await cartModel.create({
      cart_userId: userId,
      cart_id: generateCatId(),
      cart_products: [reqBody],
      cart_count_product: 1
    })
  }
  const isProductExists = foundCart.cart_products.some(p => p.skuId == skuId)
  if (!isProductExists) {
    return await cartModel.findOneAndUpdate(cartQuery,
      {
        $push: { cart_count_product: reqBody },
        $inc: { cart_count_product: 1 }
      },
      { returnDocument: 'after' }
    )
  }
  return await cartModel.findOneAndUpdate(
    { ...cartQuery, 'cart_products.skuId': skuId },
    { $inc: { 'cart_products.$.quantity': quantity } },
    { returnDocument: 'after' }
  )
}


export default {
  addToCart
}