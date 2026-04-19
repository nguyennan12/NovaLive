import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = { currentUser: null }

export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const { loginAPI } = await import('~/apis/services/userService')
    const response = await loginAPI(data)
    return response
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const { logoutAPI } = await import('~/apis/services/userService')
    await logoutAPI()
    if (showSuccessMessage) toast.success('Logged out successfully!')
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => { state.currentUser = action.payload },
    clearCurrentUser: (state) => { state.currentUser = null }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const { user, tokens } = action.payload.metadata
      state.currentUser = { ...user, accessToken: tokens.accessToken }
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
  }
})

export const { setCurrentUser, clearCurrentUser } = userSlice.actions
export const selectCurrentUser = (state) => state.user.currentUser
export const UserReducer = userSlice.reducer