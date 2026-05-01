import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { getCartAPI } from '~/common/apis/services/cartService'
import { deselectAll, toggleSelect } from '~/common/redux/cart/cartSlice'
import {
  clearFreeshipVoucher, clearProductVoucher, clearShopDiscount,
  setFreeshipVoucher, setProductVoucher, setShopDiscount
} from '~/common/redux/discount/discountSlice'
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
    // cart selection
    toggleSelect: (skuId) => dispatch(toggleSelect(skuId)),
    deselectAll: () => dispatch(deselectAll()),
    // shop discount (1 per shop)
    setShopDiscount: (shopId, discount) => dispatch(setShopDiscount({ shopId, discount })),
    clearShopDiscount: (shopId) => dispatch(clearShopDiscount(shopId)),
    // global product voucher (only 1)
    setProductVoucher: (v) => dispatch(setProductVoucher(v)),
    clearProductVoucher: () => dispatch(clearProductVoucher()),
    // global freeship voucher (only 1)
    setFreeshipVoucher: (v) => dispatch(setFreeshipVoucher(v)),
    clearFreeshipVoucher: () => dispatch(clearFreeshipVoucher())
  }
}

export const useCartCount = () => {
  const { data: shopGroups = [] } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCartAPI,
    staleTime: 1000 * 30
  })
  return shopGroups.reduce((sum, g) => sum + (g.items?.length ?? 0), 0)
}
