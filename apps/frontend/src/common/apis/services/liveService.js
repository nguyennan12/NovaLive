import authorizedAxiosInstance from '../custom/authorizeAxios'

export const joinLiveAPI = async (liveId) => {
  const response = await authorizedAxiosInstance.post(`livestream/${liveId}/join`)
  return response.metadata
}
export const startLiveAPI = async (liveId) => {
  const response = await authorizedAxiosInstance.post(`livestream/${liveId}/start`)
  return response.metadata
}
export const endLiveAPI = async (liveId) => {
  const response = await authorizedAxiosInstance.post(`livestream/${liveId}/end`)
  return response.metadata
}
export const createLiveSessionAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('livestream', data)
  return response.metadata
}
export const getActiveSessionsAPI = async (params) => {
  const response = await authorizedAxiosInstance.get('livestream/active', { params })
  return response.metadata
}


export const updateLiveSessionAPI = async (liveId, data) => {
  const response = await authorizedAxiosInstance.patch(`livestream/${liveId}`, data)
  return response.metadata
}

export const cancelLiveSessionAPI = async (liveId) => {
  const response = await authorizedAxiosInstance.patch(`livestream/${liveId}/cancel`)
  return response.metadata
}

export const addProductToLiveSession = async (liveId) => {
  const response = await authorizedAxiosInstance.post(`livestream/${liveId}/product`)
  return response.metadata
}

// --- Live Manager APIs (mock implementations — replace with real endpoints when backend is ready) ---

const MOCK_HISTORY = [
  { _id: 's1', title: 'Flash Sale Mùa Hè', scheduledAt: '2026-04-20T10:00:00Z', endedAt: '2026-04-20T12:00:00Z', duration: 7200, viewers: 450, orders: 38, revenue: 5200000, status: 'ended', description: 'Giảm giá toàn bộ sản phẩm mùa hè lên tới 50%.' },
  { _id: 's2', title: 'Ra Mắt Sản Phẩm Mới', scheduledAt: '2026-04-15T14:00:00Z', endedAt: '2026-04-15T15:30:00Z', duration: 5400, viewers: 280, orders: 21, revenue: 3800000, status: 'ended', description: '' },
  { _id: 's3', title: 'Khuyến Mãi Cuối Tuần', scheduledAt: '2026-04-12T09:00:00Z', endedAt: '2026-04-12T11:00:00Z', duration: 7200, viewers: 520, orders: 55, revenue: 8100000, status: 'ended', description: '' },
  { _id: 's4', title: 'Summer Collection Live', scheduledAt: '2026-04-08T19:00:00Z', endedAt: '2026-04-08T21:00:00Z', duration: 7200, viewers: 190, orders: 14, revenue: 2300000, status: 'ended', description: '' },
  { _id: 's5', title: 'Sale 30/4 Đặc Biệt', scheduledAt: '2026-04-05T15:00:00Z', endedAt: null, duration: null, viewers: 0, orders: 0, revenue: 0, status: 'cancelled', description: '' },
  { _id: 's6', title: 'Livestream Hàng Mới', scheduledAt: '2026-03-28T10:00:00Z', endedAt: '2026-03-28T11:30:00Z', duration: 5400, viewers: 340, orders: 29, revenue: 4150000, status: 'ended', description: '' },
  { _id: 's7', title: 'Giảm Giá Sốc', scheduledAt: '2026-03-22T14:00:00Z', endedAt: '2026-03-22T15:45:00Z', duration: 6300, viewers: 610, orders: 67, revenue: 9700000, status: 'ended', description: '' },
  { _id: 's8', title: 'Flash Sale Thứ 6', scheduledAt: '2026-03-14T20:00:00Z', endedAt: '2026-03-14T21:30:00Z', duration: 5400, viewers: 230, orders: 18, revenue: 2900000, status: 'ended', description: '' }
]

export const getLiveStatsAPI = async () => ({
  totalSessions: 24,
  currentLive: 1,
  totalRevenue: 48500000,
  avgViewers: 312,
  avgOrderValue: 285000
})

export const getLiveHistoryAPI = async (params) => {
  const response = await authorizedAxiosInstance.get(`livestream/history?${params}`)
  return response.metadata
}

const REVENUE_DATA = {
  week: [
    { label: 'T2', revenue: 2100000, viewers: 180 },
    { label: 'T3', revenue: 0, viewers: 0 },
    { label: 'T4', revenue: 3800000, viewers: 280 },
    { label: 'T5', revenue: 0, viewers: 0 },
    { label: 'T6', revenue: 5200000, viewers: 450 },
    { label: 'T7', revenue: 8100000, viewers: 520 },
    { label: 'CN', revenue: 1500000, viewers: 140 }
  ],
  month: [
    { label: 'T1', revenue: 5200000, viewers: 450 },
    { label: 'T2', revenue: 3800000, viewers: 280 },
    { label: 'T3', revenue: 8100000, viewers: 520 },
    { label: 'T4', revenue: 2300000, viewers: 190 },
    { label: 'T5', revenue: 4150000, viewers: 340 },
    { label: 'T6', revenue: 9700000, viewers: 610 },
    { label: 'T7', revenue: 2900000, viewers: 230 },
    { label: 'T8', revenue: 6300000, viewers: 395 }
  ],
  all: [
    { label: 'Th.1', revenue: 12500000, viewers: 890 },
    { label: 'Th.2', revenue: 18200000, viewers: 1240 },
    { label: 'Th.3', revenue: 9700000, viewers: 720 },
    { label: 'Th.4', revenue: 48500000, viewers: 2810 }
  ]
}

export const getLiveRevenueChartAPI = async (period) => REVENUE_DATA[period] ?? REVENUE_DATA.week
