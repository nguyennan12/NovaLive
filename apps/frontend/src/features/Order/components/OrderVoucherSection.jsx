import { Box } from '@mui/material'
import GlobalDiscountSection from '~/features/Discount/components/DIscountSelect/GlobalDiscountSection'
import { useApplyDiscounts } from '~/features/Discount/hook/useApplyDiscounts'

// Reuse GlobalDiscountSection từ features/Discount — đã được tái sử dụng từ CartSummary
// Per-shop discount được xử lý trong OrderProductList > ShopGroup > ShopDiscountPopup
// TODO: Khi có thêm loại voucher platform (flash deal, loyalty points...) thêm vào đây

function OrderVoucherSection({ subtotal = 0 }) {
  const {
    appliedProductVoucher, setProductVoucher, clearProductVoucher,
    appliedFreeshipVoucher, setFreeshipVoucher, clearFreeshipVoucher
  } = useApplyDiscounts()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>

      <GlobalDiscountSection
        appliedProductVoucher={appliedProductVoucher}
        setProductVoucher={setProductVoucher}
        clearProductVoucher={clearProductVoucher}
        appliedFreeshipVoucher={appliedFreeshipVoucher}
        setFreeshipVoucher={setFreeshipVoucher}
        clearFreeshipVoucher={clearFreeshipVoucher}
        subtotal={subtotal}
      />
    </Box>
  )
}

export default OrderVoucherSection
