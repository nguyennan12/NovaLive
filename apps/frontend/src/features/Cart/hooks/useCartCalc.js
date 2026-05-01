import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectAppliedVoucher, selectSelectedIds, selectShopDiscounts } from '~/common/redux/cart/cartSlice'


export const useCartCalc = (shopGroups) => {
  const selectedIds = useSelector(selectSelectedIds)
  const appliedVoucher = useSelector(selectAppliedVoucher)
  const shopDiscounts = useSelector(selectShopDiscounts)

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

  // Tổng giảm giá từ mã shop (mỗi shop một mã)
  const shopDiscountTotal = useMemo(() => {
    return shopGroups.reduce((acc, group) => {
      const discount = shopDiscounts?.[String(group.shopId)]
      if (!discount) return acc

      const groupSelected = group.items.filter(i => selectedIds.includes(String(i.skuId)))
      if (!groupSelected.length) return acc

      const groupSubtotal = groupSelected.reduce((s, i) => s + i.price * i.quantity, 0)
      if (discount.discount_min_value && groupSubtotal < discount.discount_min_value) return acc

      if (discount.discount_type === 'percentage') {
        const d = (groupSubtotal * discount.value) / 100
        return acc + (discount.maxValue ? Math.min(d, discount.discount_max_value) : d)
      }
      return acc + Math.min(discount.discount_value, groupSubtotal)
    }, 0)
  }, [shopGroups, shopDiscounts, selectedIds])

  const voucherDiscount = useMemo(() => {
    if (!appliedVoucher) return 0
    const { type, value, max_value } = appliedVoucher
    if (type === 'percentage') {
      const d = (subtotal * value) / 100
      return max_value ? Math.min(d, max_value) : d
    }
    return Math.min(value, subtotal)
  }, [appliedVoucher, subtotal])

  const total = Math.max(0, subtotal - shopDiscountTotal - voucherDiscount)

  return {
    selectedIds,
    allItems,
    selectedItems,
    subtotal,
    shopDiscountTotal,
    voucherDiscount,
    total,
    isAllSelected
  }
}