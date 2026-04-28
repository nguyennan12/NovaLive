import { Box, Typography } from '@mui/material'
import useCountdown from '~/common/hooks/useCountdown'


const CountdownBox = ({ value }) => (
  <Box sx={{
    bgcolor: '#1a1a1a',
    color: '#fff',
    fontWeight: 800,
    fontSize: '0.85rem',
    fontFamily: 'monospace',
    px: 0.9,
    py: 0.3,
    borderRadius: '5px',
    minWidth: 28,
    textAlign: 'center',
    letterSpacing: '0.05em'
  }}>
    {String(value).padStart(2, '0')}
  </Box>
)

export const FlashSaleCountdown = ({ endTime }) => {

  const time = useCountdown(endTime)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: { xs: 1, sm: 2 } }}>
      <CountdownBox value={time.h} />
      <Typography sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.25rem' }, color: 'text.primary', lineHeight: 1 }}>:</Typography>
      <CountdownBox value={time.m} />
      <Typography sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.25rem' }, color: 'text.primary', lineHeight: 1 }}>:</Typography>
      <CountdownBox value={time.s} />
    </Box>
  )
}
