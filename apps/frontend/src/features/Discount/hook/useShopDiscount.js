import { useQuery } from '@tanstack/react-query'
import { queryDiscountAPI } from '~/common/apis/services/discountService'
import { normalizeDiscount } from '../utils/normalizeDiscount'

export const useShopDiscount = (shopId, enabled = true) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['discounts', 'shop', shopId],
    queryFn: () => queryDiscountAPI({ shopId, status: 'active' }),
    enabled: !!shopId && enabled,
    staleTime: 60 * 1000,
    select: (raw) => {
      return raw.items
        .map(normalizeDiscount)
        .filter(d => {
          return d.status === 'active'
        })
    }
  })


  return {
    discounts: data,
    productDiscounts: data.filter(d => d.category === 'product'),
    freeshipDiscounts: data.filter(d => d.category === 'freeship'),
    isLoading
  }
}
