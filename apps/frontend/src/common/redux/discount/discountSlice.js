import { createSlice } from '@reduxjs/toolkit'

// Discount state hoàn toàn tách khỏi cartSlice:
// - shopDiscounts: mỗi shop chỉ được 1 mã (product hoặc freeship)
// - appliedProductVoucher: voucher toàn sàn loại giảm giá sản phẩm, chỉ 1
// - appliedFreeshipVoucher: voucher toàn sàn loại freeship, chỉ 1
const initialState = {
  shopDiscounts: {},
  appliedProductVoucher: null,
  appliedFreeshipVoucher: null
}

export const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    setShopDiscount: (state, action) => {
      const { shopId, discount } = action.payload
      state.shopDiscounts[String(shopId)] = discount
    },
    clearShopDiscount: (state, action) => {
      delete state.shopDiscounts[String(action.payload)]
    },
    setProductVoucher: (state, action) => {
      state.appliedProductVoucher = action.payload
    },
    clearProductVoucher: (state) => {
      state.appliedProductVoucher = null
    },
    setFreeshipVoucher: (state, action) => {
      state.appliedFreeshipVoucher = action.payload
    },
    clearFreeshipVoucher: (state) => {
      state.appliedFreeshipVoucher = null
    }
  }
})

export const {
  setShopDiscount, clearShopDiscount,
  setProductVoucher, clearProductVoucher,
  setFreeshipVoucher, clearFreeshipVoucher
} = discountSlice.actions

export const selectShopDiscounts = (state) => state.discount.shopDiscounts
export const selectAppliedProductVoucher = (state) => state.discount.appliedProductVoucher
export const selectAppliedFreeshipVoucher = (state) => state.discount.appliedFreeshipVoucher

export const DiscountReducer = discountSlice.reducer
