import { useState, useMemo } from 'react'
import { MOCK_DISCOUNTS } from '../../../../mockdata/discount'

const toDateKey = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

const normalizeDiscount = (discount) => {
  const startDateRaw = discount.discount_start_date ?? discount.startDate ?? ''
  const endDateRaw = discount.discount_end_date ?? discount.endDate ?? ''
  const startDate = toDateKey(startDateRaw)
  const endDate = toDateKey(endDateRaw)
  const isExpired = startDateRaw && endDateRaw ? new Date(endDateRaw).getTime() < Date.now() : false

  return {
    id: discount.id ?? discount._id ?? `d${Date.now()}`,
    name: discount.name ?? discount.discount_name ?? '',
    code: discount.code ?? discount.discount_code ?? null,
    category: discount.category ?? (discount.discount_target === 'shipping' ? 'freeship' : 'product'),
    type: discount.type ?? (discount.discount_type === 'fixed_amount' || discount.discount_type === 'amount' ? 'fixed' : 'percentage'),
    value: discount.value ?? discount.discount_value ?? '',
    status: discount.status ?? (isExpired ? 'expired' : discount.discount_is_active === false ? 'draft' : 'active'),
    startDate,
    endDate,
    usageLimit: discount.usageLimit ?? discount.discount_max_uses ?? '',
    usedCount: discount.usedCount ?? discount.discount_uses_count ?? 0,
    minOrder: discount.minOrder ?? discount.discount_min_value ?? 0,
    description: discount.description ?? discount.discount_description ?? '',
  }
}

export const useDiscounts = (search = '', statusFilter = 'all', typeFilter = 'all', categoryFilter = 'all') => {
  const [discounts, setDiscounts] = useState(MOCK_DISCOUNTS.map(normalizeDiscount))

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return discounts.filter((d) => {
      const matchSearch = !q ||
        d.name.toLowerCase().includes(q) ||
        (d.code && d.code.toLowerCase().includes(q))
      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      const matchType = typeFilter === 'all' || d.type === typeFilter
      const matchCategory = categoryFilter === 'all' || d.category === categoryFilter
      return matchSearch && matchStatus && matchType && matchCategory
    })
  }, [discounts, search, statusFilter, typeFilter, categoryFilter])

  const stats = useMemo(() => ({
    total: discounts.length,
    active: discounts.filter((d) => d.status === 'active').length,
    draft: discounts.filter((d) => d.status === 'draft').length,
    expired: discounts.filter((d) => d.status === 'expired').length,
    freeship: discounts.filter((d) => d.category === 'freeship').length,
    product: discounts.filter((d) => d.category === 'product').length
  }), [discounts])

  const addDiscount = (data) =>
    setDiscounts((prev) => [normalizeDiscount({ ...data, id: `d${Date.now()}`, usedCount: 0 }), ...prev])

  const updateDiscount = (id, data) =>
    setDiscounts((prev) => prev.map((d) => d.id === id ? normalizeDiscount({ ...d, ...data }) : d))

  const deleteDiscount = (id) =>
    setDiscounts((prev) => prev.filter((d) => d.id !== id))

  return { filtered, stats, addDiscount, updateDiscount, deleteDiscount }
}
