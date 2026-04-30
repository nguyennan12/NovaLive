import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded'
import { Box, Button, Collapse, Divider, InputAdornment, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { formatVND } from '~/common/utils/formatters'
import { glassSx, gradientText } from '~/theme'
import { useCart } from '../hooks/useCart'


function SummaryRow({ label, value, highlight = false, isDiscount = false }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.4 }}>
      <Typography sx={{ fontSize: '0.8rem', color: 'rgba(45,45,45,0.6)' }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: highlight ? '1.05rem' : '0.88rem',
        fontWeight: highlight ? 800 : 500,
        color: isDiscount ? 'success.main' : highlight ? 'secondary.main' : 'primary.contrastText'
      }}>
        {isDiscount && value > 0 ? `${formatVND(value)}` : formatVND(value)}
      </Typography>
    </Box>
  )
}

function CartSummary() {
  const {
    selectedItems, subtotal, itemDiscount, voucherDiscount, total,
    appliedVoucher, setVoucher, clearVoucher
  } = useCart()

  const [voucherCode, setVoucherCode] = useState('')
  const [voucherOpen, setVoucherOpen] = useState(false)
  const [applying, setApplying] = useState(false)

  const canCheckout = selectedItems.length > 0
  const totalDiscount = itemDiscount + voucherDiscount

  const handleApplyVoucher = async () => {
    const code = voucherCode.trim()
    if (!code) return
    setApplying(true)
    try {
      // TODO: gọi validateVoucherAPI(code) khi backend hỗ trợ
      // const voucher = await validateVoucherAPI(code)
      // setVoucher(voucher)
      toast.info('Tính năng mã voucher sẽ sớm có!')
    } catch {
      toast.error('Mã voucher không hợp lệ hoặc đã hết hạn')
    } finally {
      setApplying(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: { md: 'sticky' }, top: { md: 90 } }}>

      <Box sx={{ bgcolor: 'primary.main', ...glassSx, borderRadius: 3, p: 2.5 }}>
        <Typography sx={{ fontSize: '0.98rem', fontWeight: 700, ...gradientText, mb: 2 }}>
          Giỏ hàng của bạn
        </Typography>

        {/* Số lượng đã chọn */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ fontSize: '0.8rem', color: 'rgba(45,45,45,0.6)' }}>
            Sản phẩm đã chọn
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'primary.contrastText' }}>
            {selectedItems.length}
          </Typography>
        </Box>

        {/* Các dòng tính tiền */}
        <SummaryRow label="Tạm tính" value={subtotal} />
        {itemDiscount > 0 && (
          <SummaryRow label="Giảm giá sản phẩm" value={itemDiscount} isDiscount />
        )}
        {voucherDiscount > 0 && (
          <SummaryRow label="Voucher" value={voucherDiscount} isDiscount />
        )}
        <SummaryRow label="Phí vận chuyển" value={0} />

        <Divider sx={{ my: 1.5, borderColor: 'divider' }} />

        {/* Tổng giảm */}
        {totalDiscount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography sx={{ fontSize: '0.8rem', color: 'success.main', fontWeight: 500 }}>
              Tiết kiệm được
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'success.main' }}>
              &minus;&nbsp;{formatVND(totalDiscount)}
            </Typography>
          </Box>
        )}

        {/* Tổng thanh toán */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2.5 }}>
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'primary.contrastText' }}>
            Tổng thanh toán
          </Typography>
          <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: 'secondary.main', lineHeight: 1 }}>
            {formatVND(total)}
          </Typography>
        </Box>

        {/* Nút checkout */}
        <Button
          variant="contained"
          fullWidth
          disabled={!canCheckout}
          startIcon={<ShoppingCartCheckoutRoundedIcon />}
          sx={{
            textTransform: 'none', fontWeight: 700, fontSize: '0.93rem',
            borderRadius: '12px', py: 1.3,
            ...(canCheckout && {
              background: 'linear-gradient(90deg, #568dfb, #69aedc, #8acdde)',
              color: '#fff',
              '&:hover': { boxShadow: '0 6px 20px rgba(52,133,247,0.4)' }
            })
          }}
        >
          {canCheckout
            ? `Thanh toán (${selectedItems.length} sản phẩm)`
            : 'Chọn sản phẩm để mua'}
        </Button>
      </Box>

      {/* Khối voucher toàn sàn */}
      <Box sx={{
        bgcolor: 'primary.main', ...glassSx, p: 0,
        borderRadius: 3, overflow: 'hidden',
        border: '1px solid', borderColor: 'divider'
      }}>
        {/* Header toggle */}
        <Box
          onClick={() => setVoucherOpen(v => !v)}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 2.5, py: 1.75, cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(83,155,255,0.04)' },
            transition: 'background 0.18s'
          }}
        >
          <LocalOfferRoundedIcon sx={{ fontSize: 17, color: 'secondary.main' }} />
          <Typography sx={{ flex: 1, fontSize: '0.86rem', fontWeight: 600, color: 'primary.contrastText' }}>
            Mã voucher toàn sàn
          </Typography>
          {appliedVoucher && (
            <CheckCircleRoundedIcon sx={{ fontSize: 15, color: 'success.main' }} />
          )}
          <ExpandMoreRoundedIcon sx={{
            fontSize: 19, color: 'rgba(45,45,45,0.38)',
            transform: voucherOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />
        </Box>

        {/* Panel nhập voucher */}
        <Collapse in={voucherOpen}>
          <Box sx={{ px: 2.5, pb: 2 }}>
            {appliedVoucher ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ flex: 1, fontSize: '0.8rem', color: 'success.main', fontWeight: 600 }}>
                  ✓ {appliedVoucher.code} &mdash; Giảm&nbsp;
                  {appliedVoucher.type === 'percentage'
                    ? `${appliedVoucher.value}%`
                    : formatVND(appliedVoucher.value)}
                </Typography>
                <Button
                  size="small" color="error"
                  onClick={clearVoucher}
                  sx={{ textTransform: 'none', fontSize: '0.74rem', py: 0.25, minWidth: 'unset' }}
                >
                  Xóa
                </Button>
              </Box>
            ) : (
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập mã voucher..."
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyVoucher()}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          disabled={!voucherCode.trim() || applying}
                          onClick={handleApplyVoucher}
                          sx={{
                            textTransform: 'none', fontWeight: 600, fontSize: '0.74rem',
                            borderRadius: '7px', py: 0.35, px: 1.5,
                            bgcolor: 'secondary.main', color: '#fff',
                            '&:hover': { bgcolor: '#4e96f6' },
                            '&.Mui-disabled': { bgcolor: 'rgba(0,0,0,0.12)' }
                          }}
                        >
                          Áp dụng
                        </Button>
                      </InputAdornment>
                    )
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontSize: '0.83rem',
                    bgcolor: '#f5f7ff',
                    pr: 0.5
                  }
                }}
              />
            )}
          </Box>
        </Collapse>
      </Box>
    </Box>
  )
}

export default CartSummary
