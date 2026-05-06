import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import BoltIcon from '@mui/icons-material/Bolt'
import { Box, Button, CircularProgress, Divider, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCartMutations } from '~/features/Cart/hooks/useCartMutations'
import { setSelectedIds } from '~/store/cart/cartSlice'
import { formatVND } from '~/common/utils/formatters'

const LiveProductDetailPanel = ({ product, onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addToCartAsync, isPending } = useCartMutations()
  const [selectedIdx, setSelectedIdx] = useState(0)

  if (!product) return null

  const skus = product.skus ?? []
  const selectedSku = skus[selectedIdx]
  const displayPrice = selectedSku?.live_price ?? product.live_price ?? 0
  const hasSkuId = !!selectedSku?.skuId

  const handleAddToCart = async () => {
    if (!hasSkuId) { toast.warning('Chọn phân loại sản phẩm'); return }
    try {
      await addToCartAsync({ skuId: selectedSku.skuId, quantity: 1 })
      toast.success('Đã thêm vào giỏ hàng')
    } catch { /* handled in mutation */ }
  }

  const handleBuyNow = async () => {
    if (!hasSkuId) { toast.warning('Chọn phân loại sản phẩm'); return }
    try {
      await addToCartAsync({ skuId: selectedSku.skuId, quantity: 1 })
      dispatch(setSelectedIds([String(selectedSku.skuId)]))
      navigate('/order')
    } catch { /* handled in mutation */ }
  }

  return (
    <Box sx={{
      width: '100%',
      maxWidth: 340,
      background: 'rgba(12,16,42,0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.12)'
    }}>
      {/* Product image */}
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={product.thumb}
          alt={product.name}
          sx={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', bgcolor: '#2a2a2a' }}
        />
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute', top: 8, right: 8,
            bgcolor: 'rgba(0,0,0,0.55)', color: 'white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' }
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
        <Box sx={{
          position: 'absolute', bottom: 8, left: 8,
          bgcolor: '#e53935', borderRadius: 1, px: 0.75, py: 0.2
        }}>
          <Typography sx={{ color: 'white', fontSize: '0.58rem', fontWeight: 700, letterSpacing: 0.5 }}>
            GIÁ LIVE
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 1.75 }}>
        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.92rem', lineHeight: 1.4, mb: 0.5 }}>
          {product.name}
        </Typography>
        <Typography sx={{ color: '#ffd166', fontWeight: 700, fontSize: '1.2rem' }}>
          {formatVND(displayPrice)}
        </Typography>

        {/* SKU selector */}
        {skus.length > 0 && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1.25 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', mb: 0.75 }}>
              Phân loại
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {skus.map((sku, idx) => (
                <Box
                  key={sku.skuId ?? idx}
                  onClick={() => setSelectedIdx(idx)}
                  sx={{
                    border: `1.5px solid ${selectedIdx === idx ? '#7eb8ff' : 'rgba(255,255,255,0.18)'}`,
                    borderRadius: 1.5, px: 1.25, py: 0.5,
                    cursor: 'pointer',
                    bgcolor: selectedIdx === idx ? 'rgba(74,127,255,0.15)' : 'rgba(255,255,255,0.04)',
                    transition: 'all 0.15s',
                    '&:hover': { borderColor: 'rgba(126,184,255,0.6)', bgcolor: 'rgba(74,127,255,0.08)' }
                  }}
                >
                  <Typography sx={{
                    color: selectedIdx === idx ? '#7eb8ff' : 'rgba(255,255,255,0.65)',
                    fontSize: '0.75rem', lineHeight: 1.3
                  }}>
                    {sku.sku_name || `Loại ${idx + 1}`}
                  </Typography>
                  <Typography sx={{ color: '#ffd166', fontSize: '0.7rem', fontWeight: 700 }}>
                    {formatVND(sku.live_price)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1.25 }} />

        {/* CTA */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={isPending ? <CircularProgress size={14} color="inherit" /> : <ShoppingCartOutlinedIcon />}
            onClick={handleAddToCart}
            disabled={isPending || !hasSkuId}
            size="small"
            sx={{
              flex: 1, borderRadius: 2, fontWeight: 600,
              borderColor: 'rgba(255,255,255,0.28)', color: 'white',
              '&:hover': { borderColor: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.06)' },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Giỏ hàng
          </Button>
          <Button
            variant="contained"
            startIcon={<BoltIcon />}
            onClick={handleBuyNow}
            disabled={isPending || !hasSkuId}
            size="small"
            sx={{
              flex: 1, borderRadius: 2, fontWeight: 700,
              bgcolor: '#ff6b35',
              '&:hover': { bgcolor: '#e85c28' },
              '&.Mui-disabled': { bgcolor: 'rgba(255,107,53,0.3)', color: 'rgba(255,255,255,0.3)' }
            }}
          >
            Mua ngay
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default LiveProductDetailPanel
