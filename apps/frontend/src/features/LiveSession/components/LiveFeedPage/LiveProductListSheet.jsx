import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { formatVND } from '~/common/utils/formatters'

const PANEL_SX = {
  background: 'rgba(240, 246, 255, 0.97)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  borderTop: '2px solid rgba(52, 133, 247, 0.18)'
}

const ProductCard = ({ product, onClick }) => {
  const firstSku = product.skus?.[0]
  const displayPrice = firstSku?.live_price ?? product.live_price ?? 0

  return (
    <Box
      onClick={() => onClick(product)}
      sx={{
        bgcolor: '#fafafa',
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
        mx: 1.5,
        mb: 1,
        boxShadow: '0 1px 8px rgba(52,133,247,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateX(3px)', boxShadow: '0 4px 16px rgba(52,133,247,0.2)' }
      }}
    >
      <Box sx={{ width: 88, flexShrink: 0, overflow: 'hidden', minHeight: 88, position: 'relative' }}>
        <Box
          component="img"
          src={product.thumb}
          alt={product.name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {product.is_featured && (
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0,
            background: 'linear-gradient(to bottom, rgba(255,107,53,0.88), transparent)',
            display: 'flex', alignItems: 'center', gap: 0.3,
            px: 0.6, py: 0.35
          }}>
            <LocalFireDepartmentIcon sx={{ color: '#fff', fontSize: 10 }} />
            <Typography sx={{ color: '#fff', fontSize: '0.58rem', fontWeight: 700 }}>Ghim</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{
        flex: 1, px: 1.25, py: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        <Typography sx={{
          fontSize: '0.85rem', fontWeight: 700, color: '#2d2d2d',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', lineHeight: 1.4
        }}>
          {product.name}
        </Typography>

        {firstSku?.sku_name && (
          <Typography sx={{ fontSize: '0.68rem', color: '#999', mt: 0.25 }} noWrap>
            {firstSku.sku_name}
          </Typography>
        )}

        <Typography sx={{
          fontSize: '1rem', fontWeight: 800,
          color: '#3485f7', letterSpacing: '-0.02em', mt: 0.5, lineHeight: 1
        }}>
          {formatVND(displayPrice)}
        </Typography>
      </Box>
    </Box>
  )
}

const LiveProductListSheet = ({ open, onClose, products = [], onSelectProduct }) => {
  console.log("🚀 ~ LiveProductListSheet ~ products:", products)
  const navigate = useNavigate()

  const handleClick = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product)
      onClose()
    } else {
      navigate(`/product/${product.productId}`)
    }
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

      <Box sx={{
        ...PANEL_SX,
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '68%',
        borderRadius: '20px 20px 0 0',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 30,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
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

        {/* List */}
        <Box sx={{
          flex: 1, overflowY: 'auto', pt: 1,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none'
        }}>
          {products.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <ShoppingBagRoundedIcon sx={{ fontSize: 38, color: 'rgba(52,133,247,0.2)', mb: 1 }} />
              <Typography sx={{ color: '#aaa', fontSize: '0.82rem' }}>
                Chưa có sản phẩm nào
              </Typography>
            </Box>
          ) : products.map(p => (
            <ProductCard key={p.productId} product={p} onClick={handleClick} />
          ))}
        </Box>
      </Box>
    </>
  )
}

export default LiveProductListSheet
