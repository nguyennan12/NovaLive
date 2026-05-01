import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedIds: [],
  appliedVoucher: null,
  shopDiscounts: {} // { [shopId]: discountObject }
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleSelect: (state, action) => {
      const id = String(action.payload)
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(i => i !== id)
      } else {
        state.selectedIds.push(id)
      }
    },
    setSelectedIds: (state, action) => {
      state.selectedIds = action.payload.map(String)
    },
    deselectAll: (state) => {
      state.selectedIds = []
    },
    setVoucher: (state, action) => {
      state.appliedVoucher = action.payload
    },
    clearVoucher: (state) => {
      state.appliedVoucher = null
    },
    setShopDiscount: (state, action) => {
      const { shopId, discount } = action.payload
      state.shopDiscounts[String(shopId)] = discount
    },
    clearShopDiscount: (state, action) => {
      delete state.shopDiscounts[String(action.payload)]
    }
  }
})

export const {
  toggleSelect, setSelectedIds, deselectAll,
  setVoucher, clearVoucher,
  setShopDiscount, clearShopDiscount
} = cartSlice.actions

export const selectSelectedIds = (state) => state.cart.selectedIds
export const selectAppliedVoucher = (state) => state.cart.appliedVoucher
export const selectShopDiscounts = (state) => state.cart.shopDiscounts

export const CartReducer = cartSlice.reducer
