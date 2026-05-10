import CameraAltIcon from '@mui/icons-material/CameraAlt'
import EditIcon from '@mui/icons-material/Edit'
import StoreIcon from '@mui/icons-material/Store'
import StorefrontIcon from '@mui/icons-material/Storefront'
import VerifiedIcon from '@mui/icons-material/Verified'
import { Avatar, Box, Button, Chip, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { glassSx } from '~/theme'

const Banner = styled(Box)({
  height: 160,
  background: 'linear-gradient(135deg, #0095ff 0%, #14c3eb 40%, #8b5cf6 100%)',
  position: 'relative',
  borderRadius: '12px 12px 0 0',
  overflow: 'hidden',
  '@media (min-width: 600px)': { height: 200 },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.1)'
  }
})

function ProfileHeaderSkeleton() {
  return (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'primary.main', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      <Skeleton variant="rectangular" sx={{ height: { xs: 160, sm: 200 } }} />
      <Box sx={{ px: 3, pb: 3 }}>
        <Skeleton variant="circular" width={96} height={96} sx={{ mt: '-48px', mb: 1 }} />
        <Skeleton width={180} height={32} />
        <Skeleton width={130} height={20} sx={{ mt: 0.5 }} />
      </Box>
    </Box>
  )
}

const ProfileHeader = ({ profile, isLoading, onEditProfile, isShop }) => {
  const navigate = useNavigate()

  if (isLoading) return <ProfileHeaderSkeleton />

  return (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', ...glassSx }}>
      <Banner>
        <Tooltip title="Đổi ảnh bìa">
          <IconButton
            size="small"
            sx={{
              position: 'absolute', bottom: 12, right: 12, zIndex: 2,
              background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)',
              '&:hover': { background: '#fff' }
            }}
          >
            <CameraAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Banner>

      <Box sx={{ px: 3, pb: 3, position: 'relative' }}>
        <Box sx={{ position: 'relative', display: 'inline-block', mt: '-48px', mb: 1 }}>
          <Avatar
            src={profile?.user_avatar}
            sx={{
              width: 96, height: 96,
              border: '4px solid #fff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              fontSize: '2.2rem',
              background: 'linear-gradient(135deg,#0095ff,#8b5cf6)'
            }}
          >
            {profile?.user_name?.[0]?.toUpperCase()}
          </Avatar>
          <Tooltip title="Đổi ảnh đại diện">
            <IconButton
              size="small"
              sx={{
                position: 'absolute', bottom: 4, right: 0,
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid', borderColor: 'divider',
                width: 26, height: 26,
                '&:hover': { background: '#fff' }
              }}
            >
              <CameraAltIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
          justifyContent="space-between"
          gap={1.5}
        >
          <Box>
            <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap">
              <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.contrastText', lineHeight: 1.2 }}>
                {profile?.user_name || 'Người dùng'}
              </Typography>
              {isShop && (
                <Tooltip title="Tài khoản Shop đã xác thực">
                  <VerifiedIcon sx={{ color: '#0095ff', fontSize: 22 }} />
                </Tooltip>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {profile?.user_email}
            </Typography>
            {isShop && (
              <Chip
                icon={<StorefrontIcon sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
                label="Chủ cửa hàng"
                size="small"
                sx={{
                  mt: 0.75,
                  background: 'linear-gradient(90deg,#0095ff,#14c3eb)',
                  color: '#fff', fontWeight: 600, fontSize: '0.72rem', height: 22
                }}
              />
            )}
          </Box>

          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button
              variant="outlined" size="small"
              startIcon={<EditIcon sx={{ fontSize: '15px !important' }} />}
              onClick={onEditProfile}
              sx={{ borderColor: 'secondary.main', color: 'secondary.main', fontSize: '0.8rem', py: 0.6, '&:hover': { background: 'rgba(83,155,255,0.08)' } }}
            >
              Chỉnh sửa
            </Button>

            {isShop ? (
              <Button
                variant="contained" size="small"
                startIcon={<StoreIcon sx={{ fontSize: '15px !important' }} />}
                onClick={() => navigate('/dashboard/shop')}
                sx={{ background: 'linear-gradient(90deg,#0095ff,#14c3eb)', color: '#fff', fontSize: '0.8rem', py: 0.6 }}
              >
                Quản lý Shop
              </Button>
            ) : (
              <Button
                variant="outlined" size="small"
                startIcon={<StoreIcon sx={{ fontSize: '15px !important' }} />}
                sx={{ borderColor: '#8b5cf6', color: '#8b5cf6', fontSize: '0.8rem', py: 0.6, '&:hover': { background: 'rgba(139,92,246,0.08)' } }}
              >
                Mở cửa hàng
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default ProfileHeader
