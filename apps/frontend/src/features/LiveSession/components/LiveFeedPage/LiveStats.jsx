import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, IconButton, Typography } from '@mui/material'

const StatItem = ({ icon, value, onClick }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.3 }}>
    {onClick ? (
      <IconButton
        onClick={onClick}
        sx={{
          width: 42, height: 42,
          bgcolor: 'rgba(0,0,0,0.48)',
          pointerEvents: 'auto',
          '&:hover': { bgcolor: 'rgba(255,70,70,0.55)' }
        }}
      >
        {icon}
      </IconButton>
    ) : (
      <Box sx={{
        width: 42, height: 42,
        bgcolor: 'rgba(0,0,0,0.48)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {icon}
      </Box>
    )}
    <Typography sx={{
      color: 'white', fontSize: '0.7rem', fontWeight: 600,
      textShadow: '0 1px 4px rgba(0,0,0,0.9)'
    }}>
      {value}
    </Typography>
  </Box>
)

const LiveStats = ({ viewers, likes, onLike }) => (
  <Box sx={{
    position: 'absolute', right: 8, top: '60%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    pointerEvents: 'none'
  }}>
    <StatItem
      icon={<VisibilityIcon sx={{ color: 'white', fontSize: 20 }} />}
      value={viewers}
    />
    <StatItem
      icon={<FavoriteIcon sx={{ color: '#ff4d6d', fontSize: 22 }} />}
      value={likes}
      onClick={onLike}
    />
  </Box>
)

export default LiveStats
