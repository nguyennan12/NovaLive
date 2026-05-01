import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded'
import { Box, Button, Divider, Typography } from '@mui/material'
import GlobalDiscountSection from '~/features/Discount/components/cart/GlobalDiscountSection'
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
        {isDiscount && value > 0 ? `− ${formatVND(value)}` : formatVND(value)}
      </Typography>
    </Box>
  )
}

function CartSummary() {
  const {
    selectedItems, subtotal, shopDiscountTotal, voucherDiscount, total,
    appliedVoucher, setVoucher, clearVoucher
  } = useCart()

  const canCheckout = selectedItems.length > 0
  const totalDiscount = (shopDiscountTotal || 0) + (voucherDiscount || 0)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: { md: 'sticky' }, top: { md: 90 } }}>

      {/* Summary box */}
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

        <SummaryRow label="Tạm tính" value={subtotal} />
        {shopDiscountTotal > 0 && (
          <SummaryRow label="Giảm từ shop" value={shopDiscountTotal} isDiscount />
        )}
        {voucherDiscount > 0 && (
          <SummaryRow label="Voucher toàn sàn" value={voucherDiscount} isDiscount />
        )}
        <SummaryRow label="Phí vận chuyển" value={0} />

        <Divider sx={{ my: 1.5, borderColor: 'divider' }} />

        {/* Tổng tiết kiệm */}
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

        {/* Checkout button */}
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

      {/* Voucher toàn sàn */}
      <GlobalDiscountSection
        appliedVoucher={appliedVoucher}
        setVoucher={setVoucher}
        clearVoucher={clearVoucher}
        subtotal={subtotal}
      />
    </Box>
  )
}

export default CartSummary
