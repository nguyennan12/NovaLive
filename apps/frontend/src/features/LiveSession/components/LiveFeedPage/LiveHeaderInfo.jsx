import { Avatar, Box, Typography } from '@mui/material'
import LiveStatusBadge from '../shared/LiveStatusBadge'

const LiveHeaderInfo = ({ live }) => {
  const shop = live?.live_shopId

  return (
    <Box sx={{
      position: 'absolute', top: 0, left: 0, right: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 80%, transparent 100%)',
      px: 1.5, pt: 2.5, pb: 3,
      display: 'flex', alignItems: 'flex-start', gap: 1,
      pointerEvents: 'none'
    }}>
      <Avatar
        src={shop?.shop_logo}
        sx={{ width: 40, height: 40, border: '2px solid rgba(255,255,255,0.75)', flexShrink: 0 }}
      >
        {shop?.shop_name?.[0]?.toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{
            color: 'white', fontWeight: 700, fontSize: '0.87rem', lineHeight: 1.2,
            textShadow: '0 1px 4px rgba(0,0,0,0.8)'
          }} noWrap>
            {shop?.shop_name ?? 'Shop'}
          </Typography>
          <LiveStatusBadge status={live?.live_status ?? 'live'} />
        </Box>
        <Typography sx={{
          color: 'rgba(255,255,255,0.82)', fontSize: '0.75rem', mt: 0.25,
          textShadow: '0 1px 3px rgba(0,0,0,0.7)'
        }} noWrap>
          {live?.live_title ?? ''}
        </Typography>
      </Box>
    </Box>
  )
}

export default LiveHeaderInfo
