import { Box, Typography, Tooltip, Skeleton } from '@mui/material'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { RESERVED_STOCK } from '../../../../../mockdata/stockdata'
import SectionCard from '../shared/SectionCard'
import EmptyState from '../shared/EmptyState'

const fmt = (iso) => {
  const d = new Date(iso)
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const isExpired = (iso) => new Date(iso) < new Date()

const ReservedStock = ({ loading = false }) => (
  <SectionCard
    title='Reserved Stock'
    subtitle={`${RESERVED_STOCK.length} items temporarily held`}
  >
    {loading ? (
      Array.from({ length: 3 }).map((_, i) => (
        <Box key={i} sx={{ py: 1.5, borderBottom: '1px solid #f3f4f6' }}>
          <Skeleton variant='rounded' height={16} width='60%' sx={{ mb: 1, borderRadius: '4px' }} />
          <Skeleton variant='rounded' height={14} width='40%' sx={{ borderRadius: '4px' }} />
        </Box>
      ))
    ) : RESERVED_STOCK.length === 0 ? (
      <EmptyState icon={LockOutlinedIcon} title='No reserved stock' subtitle='Reservations will appear here' />
    ) : (
      RESERVED_STOCK.map((r) => {
        const expired = isExpired(r.expiresAt)
        return (
          <Box
            key={r.id}
            sx={{
              py: 1.5,
              px: 1.5,
              mb: 1,
              borderRadius: '10px',
              bgcolor: expired ? '#fef2f2' : '#fafafa',
              border: '1px solid',
              borderColor: expired ? '#fecaca' : '#eeeeee',
              transition: 'box-shadow 0.15s',
              '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.75 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#2d2d2d', lineHeight: 1.3 }}>
                  {r.productName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.4 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                    Order: <span style={{ color: '#3485f7', fontWeight: 600 }}>{r.orderId}</span>
                  </Typography>
                  <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#d1d5db' }} />
                  <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                    Qty: <strong style={{ color: '#2d2d2d' }}>{r.qty}</strong>
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  px: 1,
                  py: 0.3,
                  borderRadius: '6px',
                  bgcolor: expired ? '#fee2e2' : '#eff6ff',
                  flexShrink: 0
                }}
              >
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: expired ? '#ef4444' : '#3485f7' }}>
                  {expired ? 'EXPIRED' : 'ACTIVE'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title='Reserved at'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 12, color: '#9ca3af' }} />
                  <Typography sx={{ fontSize: '0.68rem', color: '#9ca3af' }}>{fmt(r.reservedAt)}</Typography>
                </Box>
              </Tooltip>
              <Tooltip title='Expires at'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 12, color: expired ? '#ef4444' : '#f59e0b' }} />
                  <Typography sx={{ fontSize: '0.68rem', color: expired ? '#ef4444' : '#f59e0b', fontWeight: 500 }}>
                    {fmt(r.expiresAt)}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          </Box>
        )
      })
    )}
  </SectionCard>
)

export default ReservedStock