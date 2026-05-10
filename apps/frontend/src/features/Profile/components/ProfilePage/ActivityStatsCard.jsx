import BarChartIcon from '@mui/icons-material/BarChart'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import PaymentsIcon from '@mui/icons-material/Payments'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import StarIcon from '@mui/icons-material/Star'
import StoreIcon from '@mui/icons-material/Store'
import { Box, Button, Divider, Grid, Paper, Skeleton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { formatCompactVND } from '~/common/utils/formatters'
import { useShop } from '~/features/Shop/hooks/useShop'
import SectionTitle from '../shared/SectionTitle'
import { glassSx } from '~/theme'

const StatBox = ({ icon: Icon, label, value, color = 'secondary.main', isLoading }) => (
  <Box sx={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    p: 1.5, borderRadius: 2,
    background: 'rgba(83,155,255,0.05)',
    border: '1px solid', borderColor: 'divider',
    gap: 0.5, textAlign: 'center',
    minWidth: '100px'
  }}>
    <Icon sx={{ color, fontSize: 26 }} />
    {isLoading ? (
      <Skeleton width={44} height={24} />
    ) : (
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'primary.contrastText', lineHeight: 1.2 }}>
        {value}
      </Typography>
    )}
    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1.2 }}>
      {label}
    </Typography>
  </Box>
)

const ActivityStatsCard = ({ totalOrders, totalSpent, pendingOrders, isLoading, isShop }) => {
  const navigate = useNavigate()
  const { shop, isLoading: shopLoading } = useShop()
  const metrics = shop?.shop_metrics || {}

  if (isShop) {
    return (
      <Paper
        elevation={0}
        sx={{ borderRadius: 3, p: { xs: 2, sm: 2.5 }, bgcolor: 'primary.main', border: '1px solid', borderColor: 'divider', height: '100%', minWidth: '360px', ...glassSx }}
      >
        <SectionTitle title="Thống kê cửa hàng" icon={BarChartIcon} accentColor="#f59e0b" />

        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
          <Grid xs={4}>
            <StatBox icon={LocalMallIcon} label="Đã bán" value={metrics.total_sold ?? 0} color="#14c3eb" isLoading={shopLoading} />
          </Grid>
          <Grid xs={4}>
            <StatBox icon={InventoryIcon} label="Sản phẩm" value={metrics.total_products ?? 0} color="#8b5cf6" isLoading={shopLoading} />
          </Grid>
          <Grid xs={4}>
            <StatBox icon={GroupIcon} label="Theo dõi" value={metrics.follower_count ?? 0} color="#10b981" isLoading={shopLoading} />
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 2 }}>
          <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'primary.contrastText' }}>
            {metrics.rating_avg?.toFixed(1) || '0.0'}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>/ 5.0 đánh giá</Typography>
        </Box>

        <Divider sx={{ mb: 1.5, opacity: 0.5 }} />

        <Button
          fullWidth size="small" variant="contained"
          startIcon={<StoreIcon />}
          onClick={() => navigate('/dashboard/shop')}
          sx={{ background: 'linear-gradient(90deg,#0095ff,#14c3eb)', color: '#fff' }}
        >
          Vào Dashboard Shop
        </Button>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: 3, p: { xs: 2, sm: 2.5 }, bgcolor: 'primary.main', border: '1px solid', borderColor: 'divider', minWidth: '360px', ...glassSx }}
    >
      <SectionTitle title="Hoạt động" icon={BarChartIcon} accentColor="#f59e0b" />

      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Grid xs={4}>
          <StatBox icon={ShoppingBagIcon} label="Tổng đơn" value={totalOrders} isLoading={isLoading} />
        </Grid>
        <Grid xs={4}>
          <StatBox
            icon={PaymentsIcon}
            label="Đã chi"
            value={formatCompactVND(totalSpent)}
            color="#14c3eb"
            isLoading={isLoading}
          />
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

export default ActivityStatsCard
