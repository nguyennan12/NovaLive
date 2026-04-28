import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  cancelLiveSessionAPI,
  createLiveSessionAPI,
  getLiveHistoryAPI,
  getLiveRevenueChartAPI,
  getLiveStatsAPI,
  startLiveAPI,
  updateLiveSessionAPI
} from '~/common/apis/services/liveService'

const UPCOMING_MOCK = {
  _id: 'upcoming1',
  title: 'Flash Sale Tháng 5',
  scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  description: 'Giảm đến 50% toàn bộ sản phẩm mùa hè! Đừng bỏ lỡ.',
  thumbnail: null,
  status: 'scheduled'
}

export const useLiveStats = () =>
  useQuery({
    queryKey: ['live', 'stats'],
    queryFn: getLiveStatsAPI,
    staleTime: 30 * 1000
  })

export const useUpcomingSession = () =>
  useQuery({
    queryKey: ['live', 'upcoming'],
    queryFn: async () => UPCOMING_MOCK,
    staleTime: 30 * 1000
  })

export const useSessionHistory = (params) => {

  const { data = [] } = useQuery({
    queryKey: ['live', 'history', params],
    queryFn: () => getLiveHistoryAPI(params),
    staleTime: 20 * 1000
  })
  const sessions = data?.lives || []
  const totalPages = data?.totalPages || 1
  return { sessions, totalPages }
}

export const useLiveRevenueChart = (period) =>
  useQuery({
    queryKey: ['live', 'revenue', period],
    queryFn: () => getLiveRevenueChartAPI(period),
    staleTime: 30 * 1000
  })

export const useCreateSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createLiveSessionAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['live'] })
  })
}

export const useUpdateSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sessionId, data }) => updateLiveSessionAPI(sessionId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['live'] })
  })
}

export const useCancelSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelLiveSessionAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['live'] })
  })
}

export const useStartSession = () => useMutation({ mutationFn: startLiveAPI })
