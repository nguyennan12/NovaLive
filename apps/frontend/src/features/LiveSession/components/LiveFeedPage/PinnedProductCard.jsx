import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Box, ButtonBase, Typography } from '@mui/material'
import { formatVND } from '~/common/utils/formatters'

const PinnedProductCard = ({ product, onClick }) => {
  if (!product) return null

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        position: 'absolute',
        bottom: 196,
        left: 10,
        width: '66%',
        bgcolor: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 2,
        p: 0.8,
        display: 'flex', alignItems: 'center', gap: 1,
        border: '1px solid rgba(255,255,255,0.15)',
        textAlign: 'left',
        pointerEvents: 'auto',
        transition: 'background 0.15s',
        '&:hover': { bgcolor: 'rgba(0,0,0,0.72)' }
      }}
    >
      {product.thumb && (
        <Box
          component="img"
          src={product.thumb}
          alt={product.name}
          sx={{ width: 44, height: 44, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }}
        />
      )}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
          <LocalFireDepartmentIcon sx={{ color: '#ff6b35', fontSize: 12, flexShrink: 0 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.62rem', fontWeight: 500 }}>
            Đang bán
          </Typography>
        </Box>
        <Typography sx={{
          color: 'white', fontSize: '0.74rem', fontWeight: 600, lineHeight: 1.3, mt: 0.1
        }} noWrap>
          {product.name}
        </Typography>
        <Typography sx={{ color: '#ffd166', fontSize: '0.73rem', fontWeight: 700 }}>
          {formatVND(product.live_price)}
        </Typography>
      </Box>

      <Box sx={{
        bgcolor: 'rgba(255,107,53,0.85)',
        borderRadius: 1, p: 0.45, flexShrink: 0, display: 'flex'
      }}>
        <ShoppingCartIcon sx={{ color: 'white', fontSize: 16 }} />
      </Box>
    </ButtonBase>
  )
}

export default PinnedProductCard
