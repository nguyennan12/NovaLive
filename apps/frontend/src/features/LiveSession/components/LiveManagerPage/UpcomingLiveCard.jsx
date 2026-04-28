import { useState } from 'react'
import { Box, Button, Skeleton, Typography } from '@mui/material'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmDialog from '~/common/components/common/form/ConfirmDialog'
import SectionCard from '~/features/Inventory/components/shared/SectionCard'
import LiveStatusBadge from '../shared/LiveStatusBadge'
import { useCancelSession, useStartSession, useUpcomingSession } from '../../hooks/useLiveSessions'

const UpcomingLiveCard = ({ onEdit }) => {
  const navigate = useNavigate()
  const [cancelOpen, setCancelOpen] = useState(false)

  const { data: session, isLoading } = useUpcomingSession()
  const startSession = useStartSession()
  const cancelSession = useCancelSession()

  const handleStart = async () => {
    if (!session) return
    await toast.promise(
      startSession.mutateAsync(session._id),
      { pending: 'Đang khởi động...', error: 'Không thể bắt đầu live' }
    )
    navigate(`/shop/live/${session._id}`)
  }

  const handleConfirmCancel = async () => {
    await toast.promise(
      cancelSession.mutateAsync(session._id),
      { pending: 'Đang hủy...', success: 'Phiên live đã bị hủy', error: 'Hủy thất bại' }
    )
    setCancelOpen(false)
  }

  if (isLoading) {
    return (
      <SectionCard title='Phiên Live Sắp Tới'>
        <Skeleton variant='rectangular' height={160} sx={{ borderRadius: 2 }} />
      </SectionCard>
    )
  }

  if (!session) {
    return (
      <SectionCard title='Phiên Live Sắp Tới' sx={{ height: '100%' }}>
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <CalendarMonthRoundedIcon sx={{ fontSize: 52, color: '#e2e8f0', mb: 1.5 }} />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>
            Chưa có phiên nào được lên lịch
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#cbd5e1', mt: 0.5 }}>
            Hãy tạo phiên live đầu tiên của bạn!
          </Typography>
        </Box>
      </SectionCard>
    )
  }

  return (
    <>
      <SectionCard title='Phiên Live Sắp Tới' subtitle='Phiên được lên lịch gần nhất' sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', flex: 1, lineHeight: 1.3 }}>
              {session.title}
            </Typography>
            <LiveStatusBadge status={session.status} />
          </Box>

          {session.description && (
            <Typography sx={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55 }}>
              {session.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthRoundedIcon sx={{ fontSize: 15, color: '#94a3b8', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>
              {new Date(session.scheduledAt).toLocaleString('vi-VN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto', pt: 1 }}>
            <Button
              variant='contained'
              size='small'
              startIcon={<PlayArrowRoundedIcon />}
              onClick={handleStart}
              disableElevation
              disabled={startSession.isPending}
              sx={{
                background: 'linear-gradient(90deg, #74a2ffff, #69aedc, #8acdde)',
                fontWeight: 600,
                borderRadius: '8px',
                flex: 1,
                color: 'white'
              }}
            >
              Bắt Đầu
            </Button>
            <Button
              variant='outlined'
              size='small'
              startIcon={<EditRoundedIcon />}
              onClick={() => onEdit?.(session)}
              sx={{ borderColor: '#e2e8f0', color: '#64748b', fontWeight: 600, borderRadius: '8px' }}
            >
              Sửa
            </Button>
            <Button
              variant='outlined'
              size='small'
              startIcon={<CancelRoundedIcon />}
              onClick={() => setCancelOpen(true)}
              sx={{ borderColor: '#fecaca', color: '#ef4444', fontWeight: 600, borderRadius: '8px' }}
            >
              Hủy
            </Button>
          </Box>
        </Box>
      </SectionCard>

      <ConfirmDialog
        open={cancelOpen}
        title='Hủy phiên live?'
        content={`Bạn có chắc muốn hủy phiên "${session.title}"? Hành động này không thể hoàn tác.`}
        confirmText='Hủy phiên live'
        cancelText='Giữ lại'
        isLoading={cancelSession.isPending}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelOpen(false)}
      />
    </>
  )
}

export default UpcomingLiveCard
