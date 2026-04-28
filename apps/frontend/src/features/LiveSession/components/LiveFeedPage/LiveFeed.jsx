import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import LivePlayer from '../shared/LivePlayer'
import { useLiveFeed } from '../../hooks/useLiveFeed'

export const LiveFeed = ({ userId }) => {
  const { lives, loading, currentIndex, goNext, goPrev, loadingMore, handleTouchEnd, handleTouchStart, handleWheel } = useLiveFeed()

  if (loading) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'black' }}>
      <CircularProgress sx={{ color: 'white' }} />
    </Box>
  )

  if (lives.length === 0) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'black' }}>
      <Typography color="white">Không có live nào đang phát</Typography>
    </Box>
  )

  const currentLive = lives[currentIndex]

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 400,
        height: '98vh',
        mx: 'auto',
        bgcolor: '#101010',
        overflow: 'hidden',
        userSelect: 'none',
        borderRadius: '18px'
      }}
    >

      <LivePlayer
        key={currentLive._id}
        liveId={currentLive._id}
        userId={userId}
      />

      <Box sx={{
        position: 'absolute', right: 12, top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 1
      }}>
        <IconButton
          onClick={goPrev}
          disabled={currentIndex === 0}
          sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
        <IconButton
          onClick={goNext}
          disabled={currentIndex >= lives.length - 1}
          sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </Box>

      <Box sx={{
        position: 'absolute', bottom: 16, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 0.5
      }}>
        {lives.map((_, i) => (
          <Box key={i} sx={{
            width: i === currentIndex ? 20 : 6,
            height: 6, borderRadius: 3,
            bgcolor: i === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
            transition: 'width 0.3s'
          }} />
        ))}
        {loadingMore && <CircularProgress size={12} sx={{ color: 'white', ml: 0.5 }} />}
      </Box>
    </Box>
  )
}

