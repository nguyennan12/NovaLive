import { useState } from 'react'
import { Box, Typography, IconButton, Tooltip, Collapse } from '@mui/material'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'

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
  const [liked, setLiked] = useState(false)
  const [actionsOpen, setActionsOpen] = useState(false)
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
            height: { xs: 120, sm: 150 },
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
          <IconButton
            size='small'
            onClick={() => setLiked((v) => !v)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'tranparent',
              width: 32,
              height: 32,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              '&:hover': { bgcolor: '#c4c4c4' }
            }}
          >
            {liked
              ? <FavoriteRoundedIcon sx={{ fontSize: 16, color: '#f87171' }} />
              : <FavoriteBorderRoundedIcon sx={{ fontSize: 16, color: '#535353' }} />
            }
          </IconButton>
        </Box>
      </Box>

      {/* Info */}
      <Box sx={{ px: 2, pt: 1.25, pb: 1.75 }}>
        <Typography
          noWrap
          sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.02em' }}
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

        {/* Actions toggle */}
        <Box sx={{ mt: 1.25, borderTop: '1px solid rgba(255,255,255,0.06)', pt: 1 }}>
          <Box
            onClick={() => setActionsOpen((v) => !v)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.4,
              cursor: 'pointer',
              opacity: actionsOpen ? 0.7 : 0.35,
              '&:hover': { opacity: 0.75 },
              transition: 'opacity 0.15s'
            }}
          >
            <Typography sx={{ fontSize: '0.6rem', color: 'primary.contractText', letterSpacing: '0.08em', fontWeight: 600 }}>
              MANAGE
            </Typography>
            {actionsOpen
              ? <ExpandLessRoundedIcon sx={{ fontSize: 13, color: 'primary.contractText' }} />
              : <ExpandMoreRoundedIcon sx={{ fontSize: 13, color: 'primary.contractText' }} />
            }
          </Box>

          <Collapse in={actionsOpen}>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center' }}>
              <Tooltip title='Edit'>
                <IconButton
                  size='small'
                  onClick={() => onEdit && onEdit(product)}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.07)',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: 'rgba(100,160,255,0.18)', color: '#7ab8ff' }
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 15, color: '#bbb' }} />
                </IconButton>
              </Tooltip>

              <Tooltip title='Delete'>
                <IconButton
                  size='small'
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.07)',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: 'rgba(248,113,113,0.18)', color: '#f87171' }
                  }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 15, color: '#bbb' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  )
}

export default ProductCard