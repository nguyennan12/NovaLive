import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { getCartAPI } from '~/common/apis/services/cartService'
import { clearVoucher, deselectAll, setVoucher, toggleSelect } from '~/common/redux/cart/cartSlice'
import { useCartCalc } from './useCartCalc'
import { useCartMutations } from './useCartMutations'


export const CART_QUERY_KEY = ['cart']

export const useCart = () => {
  const dispatch = useDispatch()

  const { data: shopGroups = [], isLoading } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCartAPI,
    staleTime: 1000 * 30
  })

  const calculations = useCartCalc(shopGroups)

  const mutations = useCartMutations()


  return {
    ...calculations,
    ...mutations,
    isLoading,
    shopGroups,
    toggleSelect: (skuId) => dispatch(toggleSelect(skuId)),
    deselectAll: () => dispatch(deselectAll()),
    setVoucher: (v) => dispatch(setVoucher(v)),
    clearVoucher: () => dispatch(clearVoucher())
  }
}

//hook lấy số lượng cart
export const useCartCount = () => {
  const { data: shopGroups = [] } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCartAPI,
    staleTime: 1000 * 30
  })
  return useMemo(
    () => shopGroups.reduce(
      (sum, g) => sum + g.items.reduce((s, i) => s + i.quantity, 0),
      0
    ),
    [shopGroups]
  )
}
