const toDateKey = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

export const normalizeDiscount = (discount) => {
  // Dates — backend: discount_start_date, discount_end_date
  const startDateRaw = discount.discount_start_date ?? discount.startDate ?? ''
  const endDateRaw = discount.discount_end_date ?? discount.endDate ?? ''
  const isExpired = endDateRaw ? new Date(endDateRaw).getTime() < Date.now() : false
  // discount_is_active: true = đang hoạt động, false = tạm dừng
  const isActive = discount.discount_is_active ?? discount.is_active ?? true

  // discount_target: 'product' | 'shipping' → normalize về 'product' | 'freeship'
  const rawTarget = discount.discount_target ?? discount.category ?? 'product'
  const category = rawTarget === 'shipping' ? 'freeship' : rawTarget

  // discount_type: 'percentage' | 'fixed_amount' → 'percentage' | 'fixed'
  const rawType = discount.discount_type ?? discount.type ?? 'percentage'
  const type = rawType === 'fixed_amount' ? 'fixed' : rawType

  const status = discount.status
    ?? (isExpired ? 'expired' : !isActive ? 'draft' : 'active')

  return {
    id: discount._id ?? discount.id ?? discount.discount_code ?? `d${Date.now()}`,
    name: discount.discount_name ?? discount.name ?? '',
    code: discount.discount_code ?? discount.code ?? null,
    category,
    type,
    value: Number(discount.discount_value ?? discount.value ?? 0),
    max_value: discount.discount_max_value ?? discount.max_value ?? null,
    maxValue: discount.discount_max_value ?? discount.maxValue ?? null,
    minOrder: Number(discount.discount_min_value ?? discount.minOrder ?? 0),
    status,
    startDate: toDateKey(startDateRaw),
    endDate: toDateKey(endDateRaw),
    usageLimit: discount.discount_max_uses ?? discount.usageLimit ?? 0,
    usedCount: discount.discount_uses_count ?? discount.usedCount ?? 0,
    description: discount.discount_description ?? discount.description ?? ''
  }
}
