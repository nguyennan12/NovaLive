import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  queryDiscountAPI
} from '~/common/apis/services/discountService'
import { selectCurrentUser } from '~/common/redux/user/userSlice'
import { LIMIT } from '~/common/utils/constant'
import { useDiscountMutations } from './useDiscountMutations'

const toDateKey = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

const safeArray = (value) => (Array.isArray(value) ? value : [])

const normalizeDiscount = (discount) => {
  const startDateRaw = discount.discount_start_date ?? discount.startDate ?? ''
  const endDateRaw = discount.discount_end_date ?? discount.endDate ?? ''
  const startDate = toDateKey(startDateRaw)
  const endDate = toDateKey(endDateRaw)
  const isExpired = startDateRaw && endDateRaw ? new Date(endDateRaw).getTime() < Date.now() : false

  return {
    id: discount.id ?? discount._id ?? discount.discount_code ?? `d${Date.now()}`,
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
    description: discount.description ?? discount.discount_description ?? ''
  }
}

export const useDiscounts = (search = '', statusFilter = 'all', typeFilter = 'all', categoryFilter = 'all') => {
  const user = useSelector(selectCurrentUser)
  const discountMutations = useDiscountMutations()

  const listQueryParams = useMemo(() => {
    const params = {
      limit: LIMIT.DISCOUNT,
      page: 1,
      shopId: user?.user_shop
    }
    if (search?.trim()) params.search = search.trim()
    if (statusFilter !== 'all') params.status = statusFilter
    if (typeFilter !== 'all') params.type = typeFilter === 'fixed' ? 'fixed_amount' : typeFilter
    if (categoryFilter !== 'all') params.target = categoryFilter === 'freeship' ? 'shipping' : categoryFilter
    return params
  }, [search, statusFilter, typeFilter, categoryFilter, user?.user_shop])

  const {
    data: filtered = [],
    isLoading,
    isFetching,
    error
  } = useQuery({
    queryKey: ['discounts', 'list', listQueryParams],
    queryFn: () => queryDiscountAPI(listQueryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 20 * 1000,
    select: (raw) => safeArray(raw?.items).map(normalizeDiscount)
  })

  const stats = useMemo(() => ({
    total: filtered.length,
    active: filtered.filter((d) => d.status === 'active').length,
    draft: filtered.filter((d) => d.status === 'draft').length,
    expired: filtered.filter((d) => d.status === 'expired').length,
    freeship: filtered.filter((d) => d.category === 'freeship').length,
    product: filtered.filter((d) => d.category === 'product').length
  }), [filtered])

  return {
    filtered,
    stats,
    isLoading,
    isFetching,
    error,
    ...discountMutations
  }
}
