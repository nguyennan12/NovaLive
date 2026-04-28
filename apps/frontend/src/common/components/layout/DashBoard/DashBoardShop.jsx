import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar from '../SideBar/SideBarShop/SideBarShop'

const DashboardShop = () => {
  return (
    < Box sx={{ background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #f5f8ff 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box sx={{ p: 2, height: '100vh', position: 'sticky' }}>
          <Sidebar />
        </Box>
        <Box
          component='main'
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box >
  )
}

export default DashboardShop