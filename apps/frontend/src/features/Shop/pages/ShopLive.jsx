import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/store/user/userSlice'
import LiveHost from '../components/LiveHost'
function ShopLive() {
  const { liveId } = useParams()
  const currentUser = useSelector(selectCurrentUser)

  if (!currentUser) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#0a0a0a' }}>
      <CircularProgress sx={{ color: '#fff' }} />
    </Box>
  )

  if (!liveId) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#0a0a0a' }}>
      <Typography color="white">Không tìm thấy live session</Typography>
    </Box>
  )

  return <LiveHost liveId={liveId} />
}

export default ShopLive