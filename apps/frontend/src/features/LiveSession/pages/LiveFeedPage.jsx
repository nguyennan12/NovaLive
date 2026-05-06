import { useState } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/store/user/userSlice'
import { LiveFeed } from '../components/LiveFeedPage/LiveFeed'
import LiveProductDetailPanel from '../components/LiveFeedPage/LiveProductDetailPanel'
import ProductDetailSheet from '../components/LiveFeedPage/ProductDetailSheet'

const LiveFeedPage = () => {
  const currentUser = useSelector(selectCurrentUser)
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [detailProduct, setDetailProduct] = useState(null)

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 400px 1fr' },
      height: '100vh',
      bgcolor: '#ffffffff',
      overflow: 'hidden'
    }}>
      {/* Left - empty sidebar (future) */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }} />

      {/* Center - live feed */}
      <Box sx={{ height: '100vh', position: 'relative' }}>
        <LiveFeed
          userId={currentUser._id}
          onSelectProduct={setDetailProduct}
        />
      </Box>

      {/* Right - product detail panel (desktop only) */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        p: 2, pt: 6,
        overflow: 'auto'
      }}>
        {detailProduct && (
          <LiveProductDetailPanel
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
          />
        )}
      </Box>

      {/* Mobile - bottom sheet detail (chỉ hiện khi không phải desktop) */}
      {!isDesktop && (
        <ProductDetailSheet
          open={!!detailProduct}
          onClose={() => setDetailProduct(null)}
          product={detailProduct}
        />
      )}
    </Box>
  )
}

export default LiveFeedPage
