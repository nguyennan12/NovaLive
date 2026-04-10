import ApiError from '#core/error.response.js'
import cartModel from '#models/cart.model.js'
import { StatusCodes } from 'http-status-codes'
import converter from '#utils/converter.js'
import { skuModel } from '#models/sku.model.js'
import discountService from './discount.service.js'
import shippingService from './shipping.service.js'

const checkoutReview = async ({ userId, reqBody }) => {
  const { cartId, shopOrderIds, userAddress } = reqBody
  const foundCart = await cartModel.findOne({ _id: converter.toObjectId(cartId), cart_state: 'active' })
  if (!foundCart) throw new ApiError(StatusCodes.BAD_REQUEST, 'Cart not found')

  //duyệt order của từng shop
  const shopOrderIdsNew = await Promise.all(
    shopOrderIds.map(async (shopOrder) => {
      const { shopId, item_products, shop_discount = [] } = shopOrder
      //lấy danh sách các sku id
      const skuIds = item_products.map(item => item.skuId)

      //chọc vào Db tìm sku và price tương ứng của nó để cộng dồn giá tiến
      const skus = await skuModel.find({ _id: { $in: skuIds } }).lean()
      const skuMap = skus.reduce((dict, sku) => {
        dict[sku._id] = sku
        return dict
      }, {})
      const { rawPrice, totalWeight } = await item_products.reduce((acc, product) => {
        const sku = skuMap[product.skuId]
        acc.rawPrice += (product.quantity * sku.sku_price)
        acc.totalWeight += (product.quantity * sku.sku_weight)
        return acc
      }, { rawPrice: 0, totalWeight: 0 })
      const feeShip = await shippingService.calculateFee({ shopId, toAddress: userAddress, weight: totalWeight })
      //thông tin của 1 checkout (one shop)
      const itemCheckout = {
        shopId,
        shop_discount,
        rawPrice,
        feeShip,
        discountAmountFeeShip: 0,
        feeShipApplyDiscount: feeShip,
        discountAmoutProduct: 0,
        priceApplyDiscount: rawPrice,
        item_products
      }

      //nếu có discount áp dụng
      if (shop_discount.length > 0) {
        //lọc thành object discout key(target) : value(discount) chỉ lấy 1
        const discountMap = shop_discount.reduce((dict, discount) => {
          if (!dict[discount.target]) dict[discount.target] = discount
          return dict
        }, {})
        const [productResult, shippingResult] = await Promise.all([
          discountMap['product']?.code
            ? discountService.getDiscountAmout({
              userId,
              reqBody: {
                code: discountMap['product'].code,
                shopId,
                totalOrder: rawPrice
              }
            })
            : Promise.resolve(null),

          discountMap['shipping']?.code
            ? discountService.getDiscountAmout({
              userId,
              reqBody: {
                code: discountMap['shipping'].code,
                shopId,
                totalOrder: feeShip
              }
            })
            : Promise.resolve(null)
        ])
        //tính toán lại giá product và shipping
        if (productResult && productResult.discountAmout > 0) {
          itemCheckout.priceApplyDiscount = productResult?.priceApplyDiscount
          itemCheckout.discountAmoutProduct = productResult?.discountAmout
        }
        if (shippingResult && shippingResult.discountAmout > 0) {
          itemCheckout.feeShipApplyDiscount = shippingResult?.priceApplyDiscount
          itemCheckout.discountAmountFeeShip = shippingResult?.discountAmout
        }

      }
      //trả về thông tin checkout của 1 shop
      return itemCheckout
    })
  )
  //tổng order của tất cả các shop
  const checkoutOrder = shopOrderIdsNew.reduce((acc, shop) => {
    acc.totalPrice += shop.rawPrice
    acc.totalDiscount += (shop.discountAmoutProduct + shop.discountAmountFeeShip || 0)
    acc.feeShip += (shop.feeShip || 0)
    return acc
  }, { totalPrice: 0, feeShip: 0, totalDiscount: 0, finalCheckout: 0 })
  //tính lại giá cuối cùng của order
  checkoutOrder.finalCheckout = checkoutOrder.totalPrice - checkoutOrder.totalDiscount + checkoutOrder.feeShip
  return {
    shopOrderIds,
    shopOrderIdsNew,
    checkoutOrder
  }
}

export default {
  checkoutReview
}