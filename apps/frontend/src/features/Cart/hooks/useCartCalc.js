import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectAppliedVoucher, selectSelectedIds } from '~/common/redux/cart/cartSlice'


export const useCartCalc = (shopGroups) => {
  const selectedIds = useSelector(selectSelectedIds)
  const appliedVoucher = useSelector(selectAppliedVoucher)

  // Flatten items trong card
  const allItems = useMemo(
    () => shopGroups.flatMap(g =>
      g.items.map(item => ({ ...item, shopId: g.shopId, shopName: g.shopName }))
    ),
    [shopGroups]
  )

  // lọc ra những item dc chọn
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
  //call api lấy amount
  const voucherDiscount = useMemo(() => {
    if (!appliedVoucher) return 0
    const { type, value, max_value } = appliedVoucher
    if (type === 'percentage') {
      const d = (subtotal * value) / 100
      return max_value ? Math.min(d, max_value) : d
    }
    return Math.min(value, subtotal)
  }, [appliedVoucher, subtotal])

  const total = Math.max(0, subtotal - voucherDiscount)

  return {
    selectedIds,
    allItems,
    selectedItems,
    subtotal,
    voucherDiscount,
    total,
    isAllSelected
  }
}