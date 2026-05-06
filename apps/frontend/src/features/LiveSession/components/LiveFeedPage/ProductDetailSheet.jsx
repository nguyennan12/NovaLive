import CloseIcon from '@mui/icons-material/Close'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {
  Box, Button, Dialog, DialogContent,
  Divider, IconButton, Typography
} from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCartMutations } from '~/features/Cart/hooks/useCartMutations'
import { setSelectedIds } from '~/store/cart/cartSlice'
import { formatVND } from '~/common/utils/formatters'

const ProductDetailSheet = ({ open, onClose, product }) => {
  console.log("🚀 ~ ProductDetailSheet ~ product:", product)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addToCartAsync, isPending } = useCartMutations()
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0)

  if (!product) return null

  const skus = product.skus ?? []
  const selectedSku = skus[selectedSkuIndex]
  const displayPrice = selectedSku?.live_price ?? product.live_price ?? 0
  const hasSkuId = !!selectedSku?.skuId

  const handleAddToCart = async () => {
    if (!hasSkuId) {
      toast.warning('Không đủ thông tin sản phẩm')
      return
    }
    try {
      await addToCartAsync({ skuId: selectedSku.skuId, quantity: 1 })
      onClose()
    } catch {
      // lỗi đã được handle trong mutation
    }
  }

  const handleBuyNow = async () => {
    if (!hasSkuId) {
      toast.warning('Không đủ thông tin sản phẩm')
      return
    }
    try {
      await addToCartAsync({ skuId: selectedSku.skuId, quantity: 1 })
      dispatch(setSelectedIds([String(selectedSku.skuId)]))
      navigate('/order')
      onClose()
    } catch {
      // lỗi đã được handle trong mutation
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%) !important',
          width: '100%',
          maxWidth: 400,
          m: 0,
          borderRadius: '20px 20px 0 0',
          bgcolor: '#1c1c1e',
          color: 'white',
          maxHeight: '78vh'
        }
      }}
      slotProps={{ backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.5)' } } }}
    >
      {/* Handle bar + close */}
      <Box sx={{ position: 'relative', pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.28)' }} />
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 10, top: 6, color: 'rgba(255,255,255,0.65)' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2, pb: 2.5, pt: 1 }}>
        {/* Ảnh + tên + giá */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
          {product.thumb && (
            <Box
              component="img"
              src={product.thumb}
              alt={product.name}
              sx={{ width: 84, height: 84, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', lineHeight: 1.4, mb: 0.75 }}>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              <Typography sx={{ color: '#ffd166', fontWeight: 700, fontSize: '1.15rem' }}>
                {formatVND(displayPrice)}
              </Typography>
              {selectedSku?.original_price && selectedSku.original_price !== displayPrice && (
                <Typography sx={{ color: 'rgba(255,255,255,0.38)', textDecoration: 'line-through', fontSize: '0.82rem' }}>
                  {formatVND(selectedSku.original_price)}
                </Typography>
              )}
              <Box sx={{ bgcolor: '#e53935', borderRadius: 0.75, px: 0.7, py: 0.15 }}>
                <Typography sx={{ color: 'white', fontSize: '0.58rem', fontWeight: 700, letterSpacing: 0.5 }}>
                  GIÁ LIVE
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* SKU selector (chỉ hiện khi có nhiều SKU) */}
        {skus.length > 1 && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1.5 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', mb: 0.75 }}>
              Phiên bản
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
              {skus.map((sku, idx) => (
                <Box
                  key={sku.skuId ?? idx}
                  onClick={() => setSelectedSkuIndex(idx)}
                  sx={{
                    border: `1.5px solid ${selectedSkuIndex === idx ? '#ffd166' : 'rgba(255,255,255,0.22)'}`,
                    borderRadius: 1.5, px: 1.25, py: 0.5,
                    cursor: 'pointer',
                    bgcolor: selectedSkuIndex === idx ? 'rgba(255,209,102,0.12)' : 'transparent',
                    transition: 'all 0.15s',
                    '&:hover': { borderColor: 'rgba(255,209,102,0.6)' }
                  }}
                >
                  <Typography sx={{
                    color: selectedSkuIndex === idx ? '#ffd166' : 'rgba(255,255,255,0.68)',
                    fontSize: '0.75rem', lineHeight: 1.3
                  }}>
                    {sku.sku_name || `Loại ${idx + 1}`}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ color: '#ffd166', fontSize: '0.72rem', fontWeight: 700 }}>
                      {formatVND(sku.live_price)}
                    </Typography>
                    {sku.original_price && sku.original_price !== sku.live_price && (
                      <Typography sx={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', fontSize: '0.62rem' }}>
                        {formatVND(sku.original_price)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1.5 }} />

        {/* CTA buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={isPending || !hasSkuId}
            sx={{
              flex: 1, borderRadius: 2,
              borderColor: 'rgba(255,255,255,0.28)',
              color: 'white',
              '&:hover': { borderColor: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.06)' },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.28)', borderColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Giỏ hàng
          </Button>
          <Button
            variant="contained"
            onClick={handleBuyNow}
            disabled={isPending || !hasSkuId}
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

        {!hasSkuId && skus.length === 0 && (
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', textAlign: 'center', mt: 1 }}>
            Chưa có thông tin chi tiết SKU
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetailSheet
