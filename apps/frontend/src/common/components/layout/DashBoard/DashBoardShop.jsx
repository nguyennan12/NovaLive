import { Box } from '@mui/material'
import Sidebar from '../SideBar/SideBarShop/SideBarShop'

const DashboardShop = ({ children }) => (
  <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box sx={{ p: 1, height: '100vh', position: 'sticky' }}>
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
        {children}
      </Box>
    </Box>
  </Box>
)

export default DashboardShop