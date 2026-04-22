import { Box, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AppBar from '../AppBar/AppBar'

const DashboardShop = ({ children }) => {
  const theme = useTheme()

  return (
    <Box sx={{ bgcolor: 'primary-main', minHeight: '100vh' }}>
      <AppBar />

      {/* Main */}
      <Container maxWidth="lg" sx={{ py: 3, height: theme.app.mainContentHeight }}>
        {children}
      </Container>
    </Box>
  )
}

export default DashboardShop