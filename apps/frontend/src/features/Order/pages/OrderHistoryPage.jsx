import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import {
  Badge, Box, Button, Container, Tab, Tabs, Typography
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ORDER_TABS } from '../constants/orderStatus'
import { useMyOrders } from '../hooks/useMyOrders'
import { useOrderHistoryMutations } from '../hooks/useOrderHistoryMutations'
import OrderDetailDrawer from '../components/OrderHistoryPage/OrderDetailDrawer'
import OrderHistoryCard, { OrderHistoryCardSkeleton } from '../components/OrderHistoryPage/OrderHistoryCard'

function EmptyOrders({ onShop }) {
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      py: 8, gap: 2, color: 'rgba(45,45,45,0.4)'
    }}>
      <ShoppingBagOutlinedIcon sx={{ fontSize: 64, opacity: 0.3 }} />
      <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: 'rgba(45,45,45,0.5)' }}>
        Chưa có đơn hàng nào
      </Typography>
      <Typography sx={{ fontSize: '0.82rem', color: 'rgba(45,45,45,0.35)', textAlign: 'center', maxWidth: 260 }}>
        Hãy mua sắm và đặt hàng để theo dõi đơn ở đây
      </Typography>
      <Button
        variant="contained"
        onClick={onShop}
        sx={{
          mt: 1, fontWeight: 700, borderRadius: 2, px: 3, py: 1,
          background: 'linear-gradient(90deg, #568dfb, #69aedc)',
          color: '#fff', fontSize: '0.875rem',
          '&:hover': { boxShadow: '0 4px 16px rgba(52,133,247,0.35)' }
        }}
      >
        Mua sắm ngay
      </Button>
    </Box>
  )
}

function OrderHistoryPage() {
  const navigate = useNavigate()
  const [tabIdx, setTabIdx] = useState(0)
  const [detailOrder, setDetailOrder] = useState(null)

  const { orders, isLoading } = useMyOrders()
  const { cancelMutation, retryVNPayMutation, invalidateOrders } = useOrderHistoryMutations()

  // Lọc theo tab phía client
  const filteredOrders = useMemo(() => {
    const tab = ORDER_TABS[tabIdx]
    if (!tab.statuses) return orders
    return orders.filter(o => tab.statuses.includes(o.order_status))
  }, [orders, tabIdx])

  // Đếm số đơn theo từng tab để hiển thị badge
  const tabCounts = useMemo(() => {
    return ORDER_TABS.map(tab => {
      if (!tab.statuses) return orders.length
      return orders.filter(o => tab.statuses.includes(o.order_status)).length
    })
  }, [orders])

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 2, sm: 3 }, pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2,
          bgcolor: 'rgba(52,133,247,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ReceiptLongRoundedIcon sx={{ fontSize: 22, color: 'secondary.main' }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: 'primary.contrastText' }}>
            Đơn hàng của tôi
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(45,45,45,0.45)' }}>
            Theo dõi và quản lý tất cả đơn hàng
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{
        bgcolor: 'primary.main',
        borderRadius: 3,
        border: '1px solid', borderColor: 'divider',
        mb: 2, overflow: 'hidden'
      }}>
        <Tabs
          value={tabIdx}
          onChange={(_, v) => setTabIdx(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 44,
            '& .MuiTabs-scrollButtons': { width: 28 },
            '& .MuiTab-root': { minHeight: 44, py: 0 }
          }}
        >
          {ORDER_TABS.map((tab, idx) => (
            <Tab
              key={tab.label}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 'inherit' }}>
                    {tab.label}
                  </Typography>
                  {tabCounts[idx] > 0 && (
                    <Badge
                      badgeContent={tabCounts[idx]}
                      sx={{
                        '& .MuiBadge-badge': {
                          position: 'static', transform: 'none',
                          fontSize: '0.62rem', fontWeight: 700,
                          height: 16, minWidth: 16, px: 0.5,
                          bgcolor: idx === tabIdx ? 'secondary.main' : 'rgba(0,0,0,0.12)',
                          color: idx === tabIdx ? '#fff' : 'rgba(45,45,45,0.6)'
                        }
                      }}
                    />
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Order list */}
      <Box>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <OrderHistoryCardSkeleton key={i} />)
        ) : filteredOrders.length === 0 ? (
          <Box sx={{
            bgcolor: 'primary.main', borderRadius: 3,
            border: '1px solid', borderColor: 'divider'
          }}>
            <EmptyOrders onShop={() => navigate('/')} />
          </Box>
        ) : (
          filteredOrders.map(order => (
            <OrderHistoryCard
              key={order._id}
              order={order}
              onViewDetail={setDetailOrder}
              cancelMutation={cancelMutation}
              retryVNPayMutation={retryVNPayMutation}
              onOrderUpdated={invalidateOrders}
            />
          ))
        )}
      </Box>

      {/* Order detail dialog */}
      <OrderDetailDrawer
        open={!!detailOrder}
        onClose={() => setDetailOrder(null)}
        order={detailOrder}
        onOrderUpdated={invalidateOrders}
      />
    </Container>
  )
}

export default OrderHistoryPage
