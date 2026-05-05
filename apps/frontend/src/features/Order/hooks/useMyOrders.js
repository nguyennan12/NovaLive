import { useQuery } from '@tanstack/react-query'
import { getMyOrdersAPI } from '~/common/apis/services/orderService'

export const useMyOrders = () => {
  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => getMyOrdersAPI({ limit: 100 }),
    staleTime: 30_000
  })

  return { orders, isLoading, isError, refetch }
}
