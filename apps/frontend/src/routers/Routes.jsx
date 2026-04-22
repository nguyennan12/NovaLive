import { Box } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import Auth from '~/features/Auth/pages/Auth'
import Live from '~/features/Live/pages/Live'
import ShopLive from '~/features/Shop/pages/ShopLive'
import AddProductPage from '~/features/Product/pages/AddProductPage/AddProductPage'
import DashboardShop from '~/common/components/layout/DashBoard/DashBoardShop'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Box> he</Box>} />
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/verify' element={<Auth />} />
      <Route path='/live' element={<Live />} />
      <Route path='/shop/live/:liveId' element={<ShopLive />} />
      <Route path='/products/create' element={<AddProductPage />} />
      <Route path='/dashboard/shop' element={<DashboardShop />} />
    </Routes>
  )
}

export default AppRoutes