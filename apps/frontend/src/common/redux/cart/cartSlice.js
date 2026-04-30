import { createSlice } from '@reduxjs/toolkit'
// - selectedIds: skuId[] (string) đang được chọn để thanh toán
// - appliedVoucher: voucher toàn sàn đang áp dụng (nữa sửa checkout)

const initialState = {
  selectedIds: [], //danh sách id của cái product dc thêm vào cart
  appliedVoucher: null
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleSelect: (state, action) => {
      const id = String(action.payload)
      //nếu có id(ở đây là product) rồi thì lọc ra
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(i => i !== id)
      } else {
        //nếu chưa có thì push vào
        state.selectedIds.push(id)
      }
    },
    //lấy toàn bộ ids
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
    }
  }
})

export const { toggleSelect, setSelectedIds, deselectAll, setVoucher, clearVoucher } = cartSlice.actions

export const selectSelectedIds = (state) => state.cart.selectedIds
export const selectAppliedVoucher = (state) => state.cart.appliedVoucher

export const CartReducer = cartSlice.reducer
