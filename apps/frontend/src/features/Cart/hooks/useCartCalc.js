import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectSelectedIds } from '~/common/redux/cart/cartSlice'
import {
  selectAppliedFreeshipVoucher,
  selectAppliedProductVoucher,
  selectShopDiscounts
} from '~/common/redux/discount/discountSlice'

const calcDiscount = (discount, baseAmount) => {
  if (!discount) return 0
  const { type, value, maxValue, minOrder } = discount
  if (minOrder && baseAmount < minOrder) return 0
  if (type === 'percentage') {
    const d = (baseAmount * value) / 100
    return maxValue ? Math.min(d, maxValue) : d
  }
  return Math.min(value, baseAmount)
}

export const useCartCalc = (shopGroups) => {
  const selectedIds = useSelector(selectSelectedIds)
  const shopDiscounts = useSelector(selectShopDiscounts)
  const appliedProductVoucher = useSelector(selectAppliedProductVoucher)
  const appliedFreeshipVoucher = useSelector(selectAppliedFreeshipVoucher)

  const allItems = useMemo(
    () => shopGroups.flatMap(g =>
      g.items.map(item => ({ ...item, shopId: g.shopId, shopName: g.shopName }))
    ),
    [shopGroups]
  )

  const selectedItems = useMemo(
    () => allItems.filter(i => selectedIds.includes(String(i.skuId))),
    [allItems, selectedIds]
  )

  const isAllSelected =
    allItems.length > 0 && allItems.every(i => selectedIds.includes(String(i.skuId)))

  const subtotal = useMemo(
    () => selectedItems.reduce((s, i) => s + i.price * i.quantity, 0),
    [selectedItems]
  )

  // Tổng giảm từ mã shop: mỗi shop 1 mã, chỉ tính category=product vào tiền
  // category=freeship chỉ hiển thị badge, không trừ vào total (ship đang = 0)
  const shopDiscountTotal = useMemo(() => {
    return shopGroups.reduce((acc, group) => {
      const discount = shopDiscounts?.[String(group.shopId)]
      if (!discount || discount.category !== 'product') return acc

      const groupSelected = group.items.filter(i => selectedIds.includes(String(i.skuId)))
      if (!groupSelected.length) return acc

      const groupSubtotal = groupSelected.reduce((s, i) => s + i.price * i.quantity, 0)
      return acc + calcDiscount(discount, groupSubtotal)
    }, 0)
  }, [shopGroups, shopDiscounts, selectedIds])

  // Voucher toàn sàn loại giảm giá sản phẩm (chỉ 1 mã)
  const productVoucherDiscount = useMemo(
    () => calcDiscount(appliedProductVoucher, subtotal),
    [appliedProductVoucher, subtotal]
  )

  // Voucher toàn sàn loại freeship — tracking, shipping hiện tại = 0
  const hasFreeshipVoucher = !!appliedFreeshipVoucher

  const total = Math.max(0, subtotal - shopDiscountTotal - productVoucherDiscount)

  return {
    selectedIds,
    allItems,
    selectedItems,
    subtotal,
    shopDiscountTotal,
    productVoucherDiscount,
    hasFreeshipVoucher,
    appliedProductVoucher,
    appliedFreeshipVoucher,
    total,
    isAllSelected
  }
}
