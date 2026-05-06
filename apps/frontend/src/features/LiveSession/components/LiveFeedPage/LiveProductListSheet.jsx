import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ProductLiveCard } from '../shared/ProductLiveCard'

const LiveProductListSheet = ({ liveShop, open, onClose, products = [] }) => {
  const navigate = useNavigate()
  const handleClick = (product) => {
    navigate(`/product/${product.code}`)
  }

  return (
    <>
      <Box
        onClick={onClose}
        sx={{
          position: 'absolute', inset: 0,
          bgcolor: 'rgba(0,0,0,0.45)',
          zIndex: 29,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.28s ease'
        }}
      />

      <Box
        onWheel={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        sx={{
          background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #f5f8ff 100%)',
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '68%',
          borderRadius: '20px 20px 0 0',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 30,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Handle */}
        <Box sx={{ pt: 1.25, pb: 0.75, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <Box
            onClick={onClose}
            sx={{
              width: 38, height: 4, borderRadius: 2,
              bgcolor: 'rgba(52,133,247,0.3)',
              cursor: 'pointer'
            }}
          />
        </Box>

        {/* Header */}
        <Box sx={{
          px: 1.75, pb: 1, flexShrink: 0,
          borderBottom: '1px solid rgba(52,133,247,0.12)'
        }}>
          <Typography sx={{ color: '#2d2d2d', fontWeight: 700, fontSize: '0.92rem' }}>
            Sản phẩm trong live
          </Typography>
          <Typography sx={{ color: '#3485f7', fontSize: '0.72rem', fontWeight: 500 }}>
            {products.length} sản phẩm
          </Typography>
        </Box>

        {/* List — stop propagation để scroll list không trigger chuyển live */}
        <Box
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          sx={{
            flex: 1, overflowY: 'auto', pt: 1,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none'
          }}
        >
          {products.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <ShoppingBagRoundedIcon sx={{ fontSize: 38, color: 'rgba(52,133,247,0.2)', mb: 1 }} />
              <Typography sx={{ color: '#aaa', fontSize: '0.82rem' }}>
                Chưa có sản phẩm nào
              </Typography>
            </Box>
          ) : products.map((p, idx) => (
            <ProductLiveCard liveShop={liveShop} key={idx} product={p} onClick={handleClick} />
          ))}
        </Box>
      </Box>
    </>
  )
}

export default LiveProductListSheet
