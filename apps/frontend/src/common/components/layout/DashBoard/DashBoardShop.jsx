import { Box } from '@mui/material'
import Sidebar from '../SideBar/SideBarShop/SideBarShop'
import ProductsPage from '~/features/Product/pages/ProductPage/ProductPage'

const DashboardShop = ({ children }) => (
  <Box sx={{ background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #f5f8ff 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box sx={{ p: 2, position: 'sticky' }}>
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box
        component='main'
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3
        }}
      >
        <ProductsPage />
      </Box>
    </Box>
  </Box>
)

export default DashboardShop