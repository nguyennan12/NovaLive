import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDiscountAPI,
  deleteDiscountAPI,
  getAllDiscountAPI,
  queryDiscountAPI,
  updateDiscountAPI
} from '~/common/apis/services/discountService'
import { LIMIT } from '~/common/utils/constant'

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
  const queryClient = useQueryClient()

  const listQueryParams = useMemo(() => {
    const params = {
      limit: LIMIT.DISCOUNT,
      page: 1
    }
    if (search?.trim()) params.search = search.trim()
    if (statusFilter !== 'all') params.status = statusFilter
    if (typeFilter !== 'all') params.type = typeFilter === 'fixed' ? 'fixed_amount' : typeFilter
    if (categoryFilter !== 'all') params.target = categoryFilter === 'freeship' ? 'shipping' : categoryFilter
    return params
  }, [search, statusFilter, typeFilter, categoryFilter])

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

  const { data: allDiscounts = [] } = useQuery({
    queryKey: ['discounts', 'stats'],
    queryFn: () => getAllDiscountAPI({ limit: LIMIT.DISCOUNT, page: 1 }),
    staleTime: 20 * 1000,
    select: (raw) => safeArray(raw).map(normalizeDiscount)
  })

  const stats = useMemo(() => ({
    total: allDiscounts.length,
    active: allDiscounts.filter((d) => d.status === 'active').length,
    draft: allDiscounts.filter((d) => d.status === 'draft').length,
    expired: allDiscounts.filter((d) => d.status === 'expired').length,
    freeship: allDiscounts.filter((d) => d.category === 'freeship').length,
    product: allDiscounts.filter((d) => d.category === 'product').length
  }), [allDiscounts])

  const createMutation = useMutation({
    mutationFn: createDiscountAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['discounts'] })
  })

  const updateMutation = useMutation({
    mutationFn: ({ discountCode, payload }) => updateDiscountAPI(discountCode, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['discounts'] })
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDiscountAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['discounts'] })
  })

  const addDiscount = async (payload) => createMutation.mutateAsync(payload)

  const updateDiscount = async (targetDiscount, payload) => {
    const discountCode = targetDiscount?.code ?? targetDiscount?.discount_code
    if (!discountCode) throw new Error('Cannot update discount without discount code')

    return updateMutation.mutateAsync({ discountCode, payload })
  }

  const deleteDiscount = async (targetDiscount) => {
    const discountCode = targetDiscount?.code ?? targetDiscount?.discount_code
    if (!discountCode) throw new Error('Cannot delete discount without discount code')

    return deleteMutation.mutateAsync(discountCode)
  }

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  return {
    filtered,
    stats,
    isLoading,
    isFetching,
    isMutating,
    error,
    addDiscount,
    updateDiscount,
    deleteDiscount
  }
}
