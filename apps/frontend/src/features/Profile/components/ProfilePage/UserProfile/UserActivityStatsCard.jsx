import BarChartIcon from '@mui/icons-material/BarChart'
import PaymentsIcon from '@mui/icons-material/Payments'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import StoreIcon from '@mui/icons-material/Store'
import { Box, Button, Divider, Grid, Paper, Skeleton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { formatCompactVND } from '~/common/utils/formatters'
import { glassSx } from '~/theme'
import SectionTitle from '../../shared/SectionTitle'

const StatBox = ({ icon: Icon, label, value, color = 'secondary.main', isLoading }) => (
  <Box sx={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    p: 1.5, borderRadius: 2,
    background: 'rgba(83,155,255,0.05)',
    border: '1px solid', borderColor: 'divider',
    gap: 0.5, textAlign: 'center', minWidth: '100px'
  }}>
    <Icon sx={{ color, fontSize: 26 }} />
    {isLoading
      ? <Skeleton width={44} height={24} />
      : <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'primary.contrastText', lineHeight: 1.2 }}>{value}</Typography>
    }
    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1.2 }}>{label}</Typography>
  </Box>
)

const UserActivityStatsCard = ({ totalOrders, totalSpent, pendingOrders, isLoading }) => {
  const navigate = useNavigate()

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, p: { xs: 2, sm: 2.5 }, bgcolor: 'primary.main', border: '1px solid', borderColor: 'divider', minWidth: '360px', ...glassSx }}>
      <SectionTitle title="Hoạt động" icon={BarChartIcon} accentColor="#f59e0b" />

      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Grid xs={4}>
          <StatBox icon={ShoppingBagIcon} label="Tổng đơn" value={totalOrders} isLoading={isLoading} />
        </Grid>
        <Grid xs={4}>
          <StatBox icon={PaymentsIcon} label="Đã chi" value={formatCompactVND(totalSpent)} color="#14c3eb" isLoading={isLoading} />
        </Grid>
        <Grid xs={4}>
          <StatBox icon={PendingActionsIcon} label="Chờ xử lý" value={pendingOrders} color="#f59e0b" isLoading={isLoading} />
        </Grid>
      </Box>

      <Button
        fullWidth size="small" variant="outlined"
        onClick={() => navigate('/orders')}
        sx={{ borderColor: 'secondary.main', color: 'secondary.main', mb: 1.5, '&:hover': { background: 'rgba(83,155,255,0.08)' } }}
      >
        Xem lịch sử đơn hàng
      </Button>

      <Divider sx={{ mb: 1.5, opacity: 0.5 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.77rem', color: 'text.secondary', mb: 1 }}>
          Muốn bán hàng trên nền tảng?
        </Typography>
        <Button
          fullWidth size="small" variant="outlined"
          startIcon={<StoreIcon />}
          sx={{ borderColor: '#8b5cf6', color: '#8b5cf6', '&:hover': { background: 'rgba(139,92,246,0.08)' } }}
        >
          Đăng ký làm Seller
        </Button>
      </Box>
    </Paper>
  )
}

export default UserActivityStatsCard
