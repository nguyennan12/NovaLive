import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { getCartAPI } from '~/common/apis/services/cartService'
import { clearShopDiscount, clearVoucher, deselectAll, setShopDiscount, setVoucher, toggleSelect } from '~/common/redux/cart/cartSlice'
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
    clearVoucher: () => dispatch(clearVoucher()),
    setShopDiscount: (shopId, discount) => dispatch(setShopDiscount({ shopId, discount })),
    clearShopDiscount: (shopId) => dispatch(clearShopDiscount(shopId))
  }
}

//hook lấy số lượng cart
export const useCartCount = () => {
  const { data: shopGroups = [] } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCartAPI,
    staleTime: 1000 * 30
  })
  return shopGroups.reduce(
    (sum, g) => sum + (g.items?.length ?? 0),
    0
  )
}
