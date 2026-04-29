import { useQuery } from '@tanstack/react-query'
import { getAllProductsAPI } from '~/common/apis/services/productService'

export const useProduct = (params = {}) => {
  const { data = [] } = useQuery({
    queryKey: ['products', params],
    queryFn: () => getAllProductsAPI(params),
    staleTime: 2 * 60 * 1000
  })
  const { products } = data
  return { products }
}
