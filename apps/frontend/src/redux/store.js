// https://redux-toolkit.js.org/tutorials/quick-start
import { configureStore } from '@reduxjs/toolkit'
import { UserReducer } from './user/userSlice'
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { CategoryReducer } from './product/categorySlice'
import createWebStorage from 'redux-persist/es/storage/createWebStorage'


const storage = createWebStorage('local')
const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user', 'category']
}

const reducers = combineReducers({
  user: UserReducer,
  category: CategoryReducer
})

const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})