import ApiError from '#shared/core/error.response.js'
import cartModel from '#modules/cart/models/cart.model.js'
import { generateCatId } from '#shared/utils/generator.js'
import { StatusCodes } from 'http-status-codes'
import inventoryService from '#modules/inventory/services/inventory.service.js'
import skuService from '../../product/services/sku.service.js'
import converter from '#shared/utils/converter.js'

const addToCart = async ({ userId, reqBody }) => {
  const { skuId, quantity } = reqBody
  //check xem quantiy thêm vào cart có đủ với số luọng trong kho k
  const available = await inventoryService.checkAvailableStock({ skuId, quantity })
  if (!available) throw new ApiError(StatusCodes.BAD_REQUEST, 'Stock is not enough')
  const cartQuery = { cart_userId: userId, cart_state: 'active' }
  const foundCart = await cartModel.findOne(cartQuery).lean()
  const itemData = {
    ...reqBody,
    addedAt: new Date()
  }
  //nếu chưa có cart thì tạo cart mới
  if (!foundCart) {
    return await cartModel.create({
      cart_userId: userId,
      cart_code: generateCatId(),
      cart_products: [itemData],
      cart_count_product: 1
    })
  }
  if (foundCart.cart_count_product > 99) throw new ApiError(StatusCodes.BAD_REQUEST, 'Cart is limit!')
  //nếu có cart rồi thì check xem có product đó chưa
  const isProductExists = foundCart.cart_products.some(p => p.skuId == skuId)
  //chưa có thì push vô mảng cart_product, tăng số lượng
  if (!isProductExists) {
    return await cartModel.findOneAndUpdate(cartQuery,
      {
        $push: { cart_products: itemData },
        $inc: { cart_count_product: 1 },
      },
      { returnDocument: 'after' }
    )
  }
  //nếu có product rồi thì tăng quantity của product đó lên thoi
  return await cartModel.findOneAndUpdate(
    { ...cartQuery, 'cart_products.skuId': skuId },
    { $inc: { 'cart_products.$.quantity': quantity } },
    { returnDocument: 'after' }
  )
}

const updateCartItemQuantity = async ({ userId, reqBody }) => {
  const { quantity, old_quantity, skuId } = reqBody
  if (quantity === 0) {
    return await removeFromCart({ userId, reqBody: { skuId } })
  }
  if (quantity > old_quantity) {
    //nếu quantity mới lớn hơn quantity cũ thì check coi nó phù hơp với trong kho không
    const available = await inventoryService.checkAvailableStock({ skuId, quantity })
    if (!available) throw new ApiError(StatusCodes.BAD_REQUEST, 'Stock is not enough')
  }
  //cập nhật quantity
  return await cartModel.findOneAndUpdate(
    { cart_userId: userId, cart_state: 'active', 'cart_products.skuId': skuId },
    { $set: { 'cart_products.$.quantity': quantity } },
    { returnDocument: 'after' }
  )
}


const removeFromCart = async ({ userId, reqBody }) => {
  const { skuIds } = reqBody
  return await cartModel.findOneAndUpdate(
    { cart_userId: userId, cart_state: 'active' },
    {
      $pull: { cart_products: { skuId: { $in: skuIds } } },
      $inc: { cart_count_product: -skuIds.length }
    },
    { returnDocument: 'after' }
  )
}

const getCart = async ({ userId }) => {
  const userCart = await cartModel
    .findOne({ cart_userId: userId, cart_state: 'active' })
    .lean()

  if (!userCart?.cart_products?.length) return []

  const skuIds = userCart.cart_products.map(i => i.skuId)

  const skusDetails = await skuService.getSkusDetails(skuIds)

  //map sku key(skuId) value(sku)
  const skuMap = new Map(
    skusDetails.map(sku => [sku.sku_id.toString(), sku])
  )

  const shopMap = new Map()

  for (const cartItem of userCart.cart_products) {
    const skuInfo = skuMap.get(cartItem.skuId.toString())
    if (!skuInfo) continue

    const shopId = cartItem.shopId?.toString() || 'unknown_shop'

    const mappedItem = {
      skuId: cartItem.skuId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: skuInfo.sku_price,
      name: skuInfo.product_name,
      image: skuInfo.sku_image,
      addedAt: cartItem.addedAt,
      skuName: skuInfo.sku_name,
      attributes: skuInfo.sku_attributes
    }

    if (!shopMap.has(shopId)) {
      shopMap.set(shopId, {
        shopId,
        shopName: skuInfo.shop_name,
        items: []
      })
    }

    shopMap.get(shopId).items.push(mappedItem)
  }

  for (const shop of shopMap.values()) {
    shop.items.sort(
      (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
    )
  }

  const items = Array.from(shopMap.values())
  return { items, cartId: userCart._id, cartCount: userCart.cart_count_product }

}

//kiểm tra các item trong cart có hợp lệ k
const validateCartItems = async ({ cartId, shopOrderIds }) => {
  const foundCart = await cartModel.findOne({ _id: converter.toObjectId(cartId), cart_state: 'active' }).lean()
  if (!foundCart) throw new ApiError(StatusCodes.BAD_REQUEST, 'Cart not found')
  const skusInDbCart = foundCart.cart_products.map(item => item.skuId.toString())
  const skusFromClient = shopOrderIds.flatMap(shop => shop.item_products.map(item => item.skuId.toString()))
  //mảng lưu danh sách sản phẩm trong db khác với sản phẩm do client gửi xuống
  const hasFakeItem = skusFromClient.some(skuId => !skusInDbCart.includes(skuId))
  if (skusInDbCart.length === 0 || hasFakeItem) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product in cart invalid!')
  }
}

export default {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  getCart,
  validateCartItems
}