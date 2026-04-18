import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import LivePlayer from '../LivePlayer/LivePlayer'
import { useLiveFeed } from '~/hooks/Live/useLiveFeed'

export const LiveFeed = ({ userId }) => {
  const { lives, currentIndex, goNext, goPrev, loadingMore, handleTouchEnd, handleTouchStart, handleWheel } = useLiveFeed()
  const currentLive = lives[currentIndex]
  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 400,
        height: '100vh',
        mx: 'auto',
        bgcolor: 'black',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Chỉ render LivePlayer của live hiện tại
          Khi currentIndex thay đổi → key thay đổi → React unmount cái cũ, mount cái mới
          LivePlayer cũ tự cleanup (leave Agora) trong useEffect return */}
      <LivePlayer
        key={currentLive._id}
        liveId={currentLive._id}
        userId={userId}
      />

      {/* Nút điều hướng */}
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

      {/* Counter */}
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

