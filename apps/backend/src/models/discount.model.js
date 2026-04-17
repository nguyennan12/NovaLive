import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { COLLECTION_NAME, DOCUMENT_NAME } from '#utils/constant.js'

const discountSchema = new Schema({
  //base
  discount_name: { type: String, required: true },
  discount_description: { type: String, required: true },
  discount_code: { type: String, required: true, unique: true },
  discount_start_date: { type: Date, required: true },
  discount_end_date: { type: Date, required: true },
  discount_is_active: { type: Boolean, default: true },
  discount_target: { type: String, enum: ['product', 'shipping'], required: true, default: 'product' },
  discount_type: { type: String, enum: ['percentage', 'fixed_amount'], default: 'amount' }, //percentage or fixed_amount
  discount_applies_to: { type: String, enum: ['all', 'specific'], default: 'all' },
  discount_scope: { type: String, enum: ['global', 'shop', 'live'], default: 'global' },
  discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop', default: null },
  // discount_liveId: { type: Schema.Types.ObjectId, ref: 'Livestream', default: null },

  //value
  discount_min_value: { type: Number, required: true }, //giá trị tối thiểu để sử dụng discount
  discount_value: { type: Number, required: true }, //10.000vnd or 10%
  discount_max_value: { type: Number, required: true }, //giá trị tối đa dc giảm của 1 discount (đổi với percentage)

  //count used
  discount_max_uses: { type: Number, required: true },//tổng số lượng dc phép dùng của discount
  discount_uses_count: { type: Number, default: 0 }, //số lượng discount đã được sử đụng
  discount_users_used: { type: [Schema.Types.ObjectId], default: [] }, // user nào đã sử dụng discount (lưu id)
  discount_max_uses_per_user: { type: Number, default: 1 }, // số discount tối đa dc sử dụng cho mỗi user
  discount_product_ids: { type: [String], default: [] }, //danh sách sản phẩm dc áp dụng discount (đối apply specific )

  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true,
  collection: COLLECTION_NAME.DISCOUNT
})

export default mongoose.model(DOCUMENT_NAME.DISCOUNT, discountSchema)