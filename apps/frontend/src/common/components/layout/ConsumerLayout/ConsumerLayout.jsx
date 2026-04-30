import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import AppBar from '../AppBar/AppBar'
import BottomActionBar from '../BottomActionBar/BottomActionBar'
import { useTheme } from '@mui/material/styles'
import { WaterDropBackground } from '../../common/style/WaterDropBackground'

function ConsumerLayout() {
  const theme = useTheme()
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar />

      <WaterDropBackground>
        <Box component="main" sx={{ pt: theme.app.appBarHeight }}>
          <Outlet />
        </Box>
      </WaterDropBackground>

      <BottomActionBar />
    </Box>
  )
}

export default ConsumerLayout
