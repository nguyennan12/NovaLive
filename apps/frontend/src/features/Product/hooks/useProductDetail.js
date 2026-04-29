import { useQuery } from '@tanstack/react-query'
import { getProductDetailAPI } from '~/common/apis/services/productService'

export const useProductDetail = (productId) => {
  return useQuery({
    queryKey: ['product_detail', productId],
    queryFn: () => getProductDetailAPI(productId),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000
  })
}
