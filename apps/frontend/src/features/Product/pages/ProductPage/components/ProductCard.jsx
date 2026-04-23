import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'

const stockConfig = {
  in: { label: 'In Stock', color: '#4ade80' },
  low: { label: 'Low', color: '#fbbf24' },
  out: { label: 'Out', color: '#f87171' }
}

const gradients = [
  'linear-gradient(135deg, #eef0f4 0%, #dde0e8 100%)',
  'linear-gradient(135deg, #f0ede8 0%, #e0d8d0 100%)',
  'linear-gradient(135deg, #eaf0ec 0%, #d4e4d8 100%)',
  'linear-gradient(135deg, #f0eaf0 0%, #e0d4e0 100%)',
  'linear-gradient(135deg, #eaeef0 0%, #d4dce4 100%)',
  'linear-gradient(135deg, #f0eeea 0%, #e4dcd4 100%)'
]

const ProductCard = ({ product, index, onEdit }) => {
  const stock = stockConfig[product.stock] || stockConfig['in']
  const gradient = gradients[index % gradients.length]

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 1px 10px rgba(79, 79, 79, 0.28)',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Image area */}
      <Box sx={{ p: 1.5, pb: 0.5 }}>
        <Box
          sx={{
            position: 'relative',
            background: gradient,
            borderRadius: '12px',
            height: { xs: 150, sm: 180 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              width: '75%',
              height: '50%',
              background: 'rgba(160,160,160,0.25)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography sx={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '0.06em' }}>
              NO IMAGE
            </Typography>
          </Box>

          {/* Heart */}
          <Tooltip title='Edit'>
            <IconButton
              size='small'
              onClick={() => onEdit && onEdit(product)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'tranparent',
                width: 32,
                height: 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                '&:hover': { bgcolor: '#c6ecff' }
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 15, color: 'secondary.main' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Info */}
      <Box sx={{ px: 2, pt: 1.25, pb: 1.75 }}>
        <Typography
          noWrap
          sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'primary.contractText', letterSpacing: '-0.02em' }}
        >
          {product.name}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#777', mt: 0.25 }}>
          {product.brand || product.category}
        </Typography>

        {/* Price + Stock pill */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
          <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: 'primary.contractText', letterSpacing: '-0.03em', lineHeight: 1 }}>
            ${product.price}
          </Typography>

          <Box
            sx={{
              bgcolor: '#f4f4f4',
              borderRadius: '10px',
              px: 1.25,
              py: 0.75,
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
              minWidth: 54
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: stock.color,
                flexShrink: 0,
                boxShadow: `0 0 5px ${stock.color}`
              }}
            />
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#333', lineHeight: 1, whiteSpace: 'nowrap' }}>
              {stock.label}
            </Typography>
          </Box>
        </Box>

      </Box>
    </Box>
  )
}

export default ProductCard