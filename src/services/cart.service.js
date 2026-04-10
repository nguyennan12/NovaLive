import ApiError from '#core/error.response.js'
import cartModel from '#models/cart.model.js'
import { generateCatId } from '#utils/generator.js'
import { StatusCodes } from 'http-status-codes'
import inventoryService from './inventory.service.js'
import skuService from './sku.service.js'

const addToCart = async ({ userId, reqBody }) => {
  const { skuId, quantity, } = reqBody
  //check xem quantiy thêm vào cart có đủ với số luọng trong kho k
  const available = await inventoryService.checkAvailableStock({ skuId, quantity })
  if (!available) throw new ApiError(StatusCodes.BAD_REQUEST, 'Stock is not enough')
  const cartQuery = { cart_userId: userId, cart_state: 'active' }
  const foundCart = await cartModel.findOne(cartQuery).lean()
  //nếu chưa có cart thì tạo cart mới
  if (!foundCart) {
    return await cartModel.create({
      cart_userId: userId,
      cart_id: generateCatId(),
      cart_products: [reqBody],
      cart_count_product: 1
    })
  }
  //nếu có cart rồi thì check xem có product đó chưa
  const isProductExists = foundCart.cart_products.some(p => p.skuId == skuId)
  //chưa có thì push vô mảng cart_product, tăng số lượng
  if (!isProductExists) {
    return await cartModel.findOneAndUpdate(cartQuery,
      {
        $push: { cart_products: reqBody },
        $inc: { cart_count_product: 1 }
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
  const { skuId } = reqBody
  return await cartModel.findOneAndUpdate(
    { cart_userId: userId, cart_state: 'active' },
    { $pull: { cart_products: { skuId: { $in: skuId } } } },
    { returnDocument: 'after' }
  )
}

const getCart = async ({ userId }) => {
  const userCart = await cartModel.findOne({ cart_userId: userId, cart_state: 'active' }).lean()
  if (!userCart || !userCart.cart_products.length) return []

  //lấy danh sách chi tiết cái sku ra
  const skuIds = userCart.cart_products.map(item => item.skuId)
  const skusDetails = await skuService.getSkusDetails(skuIds)

  //biến mảng thành 1 object
  const skuDict = skusDetails.reduce((dict, sku) => {
    dict[sku.sku_id] = sku// key(sku_id) : value(sku)
    return dict
  }, {})

  const cartFormatted = userCart.cart_products.reduce((acc, cartItem) => {
    //lấy value(name, thumb, spuId, shopId,...) tương ứng với skuId
    const skuInfo = skuDict[cartItem.skuId]
    //nếu k có tiếp acc khác
    if (!skuInfo) return acc

    //format lại data
    const mappedItem = {
      skuId: cartItem.skuId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: skuInfo.sku_price,
      name: skuInfo.product_name,
      image: skuInfo.sku_image,
      attributes: skuInfo.sku_attributes
    }
    //kiểm trả shop có tồn tại trong mảng trả về chưa (acc)
    const safeShopId = skuInfo.shop_id ? skuInfo.shop_id.toString() : 'unknown_shop'
    const existingShopIndex = acc.findIndex(shop => shop.shopId === safeShopId)

    if (existingShopIndex !== -1) {
      // Nếu có Shop này rồi thì push item vào mảng items của Shop đó
      acc[existingShopIndex].items.push(mappedItem)
    } else {
      // Nếu chưa có thì tạo mới 1 acc Shop và đẩy vào kết quả
      acc.push({
        shopId: cartItem.shopId.toString(),
        shopName: skuInfo.shop_name,
        items: [mappedItem]
      })
    }
    return acc
  }, [])
  return cartFormatted
}

export default {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  getCart
}