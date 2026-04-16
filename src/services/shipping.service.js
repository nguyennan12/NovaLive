import converter from '#utils/converter.js'
import ApiError from '#core/error.response.js'
import { StatusCodes } from 'http-status-codes'
import axios from 'axios'
import { env } from '#config/environment.config.js'
import { PREFIX } from '#utils/constant.js'
import { redisClient } from '#database/init.redis.js'

const calculateFee = async ({ shopId, toAddress, weight }) => {
  try {
    const [shopAdrress, userAddress] = await Promise.all([
      addressModel.findOne({ owner_id: shopId, owner_type: 'shop', is_default: true }),
      addressModel.findOne({ _id: converter.toObjectId(toAddress), owner_type: 'user' })
    ])
    if (!userAddress) throw new ApiError(StatusCodes.BAD_REQUEST, 'please register address before order')

    const prefix = `${PREFIX.SHIPPING_FEE}:${shopAdrress.district_id}_${userAddress.district_id}_${userAddress.ward_code}_${weight}`
    cacheFee = await redisClient.get(prefix)
    if (cacheFee) return parseInt(cachedFee, 10)

    const payload = {
      'from_district_id': shopAdrress.district_id,
      'to_district_id': userAddress.district_id,
      'to_ward_code': String(userAddress.ward_code),
      'service_type_id': 2,
      'weight': weight || 500,
      'insurance_value': 0 // bảo hiệm 0 fasle
    }

    const response = await axios.post(`${env.GHN_API_URL}/shipping-order/fee`, payload, {
      headers: {
        'Token': env.GHN_API_TOKEN,
        'ShopId': env.GHN_SHOP_ID, //shop Id yêu cầu mỗi shop phải tạo
        'Content-Type': 'application/json'
      }
    })
    const feeShip = response.data.data.total
    await redisClient.set(prefix, feeShip, 'EX', 86400) //1day
    return { userAddress, feeShip }
  } catch (error) {
    console.error('Error calcutate fee GHN:', error.response?.data || error.message)
    return { feeShip: 15000 }
  }
}

export default { calculateFee }