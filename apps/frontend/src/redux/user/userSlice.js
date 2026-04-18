import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/apis/customAxios/authorizeAxios'
import { toast } from 'react-toastify'

const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post('access/login', data)
    return response
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete('access/logout')
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
    }
    return response
  }
)


export const userSlice = createSlice({
  name: 'user',
  initialState,
  //xu ly dong bo
  reducers: {},
  //xu ly bat dong bo
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
  }
})

// Action: nơi chứa các hàm reducer để các component gọi lại băng dispath() lấy data
// export const { increment, decrement, incrementByAmount } = userSlice.actions

//Selector: nơi để các component gọi bằng ueSelector lấy dữ liệu đã cập nhất trong state Redux ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const UserReducer = userSlice.reducer