import { Box } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import Auth from '~/features/Auth/pages/Auth'
import Live from '~/features/Live/pages/Live'
import ShopLive from '~/features/Shop/pages/ShopLive'
import ProductFormPage from '~/features/Product/pages/ProductFormPage'
import DashboardShop from '~/common/components/layout/DashBoard/DashBoardShop'
import ProductsPage from '~/features/Product/pages/ProductPage'
import InventoryPage from '~/features/Inventory/pages/InventoryPage'
import { DiscountPage } from '~/features/Discount/pages/DiscountPage'
import LiveManagerPage from '~/features/LiveSession/pages/LiveManagerPage'
import { HomePage } from '~/features/Home/pages/HomePage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* AUTH */}

      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/verify' element={<Auth />} />
      {/* LIVE */}
      <Route path='/live' element={<Live />} />
      <Route path='/shop/live/:liveId' element={<ShopLive />} />
      {/* PRODUCT */}
      <Route path="/products/form" element={<ProductFormPage />} />
      <Route path="/products/form/:id" element={<ProductFormPage />} />
      <Route path='/inventory' element={<InventoryPage />} />
      <Route path='/discount' element={<DiscountPage />} />
      <Route path='/dashboard/shop' element={<DashboardShop />}>
        <Route index element={<Box>dashboard</Box>} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<Box>Orders</Box>} />
        <Route path="customers" element={<Box>customers</Box>} />
        <Route path="live" element={<LiveManagerPage />} />
        <Route path="analytics" element={<Box>analytics</Box>} />
        <Route path="finance" element={<Box>finance</Box>} />
      </Route>
    </Routes>
  )
}

export default AppRoutes