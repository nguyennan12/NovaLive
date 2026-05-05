import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { cancelOrderAPI, createVNPayUrlAPI } from '~/common/apis/services/orderService'

export const useOrderHistoryMutations = () => {
  const queryClient = useQueryClient()

  const invalidateOrders = () => queryClient.invalidateQueries({ queryKey: ['my-orders'] })

  const cancelMutation = useMutation({
    mutationFn: cancelOrderAPI,
    onSuccess: () => {
      invalidateOrders()
      toast.success('Đơn hàng đã được hủy thành công!')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Hủy đơn hàng thất bại. Vui lòng thử lại.')
    }
  })

  const retryVNPayMutation = useMutation({
    mutationFn: ({ trackingNumber, amount }) =>
      createVNPayUrlAPI({ orderId: trackingNumber, amount }),
    onSuccess: (data) => {
      if (data?.paymentUrl) window.location.href = data.paymentUrl
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Không thể tạo link thanh toán. Vui lòng thử lại.')
    }
  })

  return { cancelMutation, retryVNPayMutation, invalidateOrders }
}
