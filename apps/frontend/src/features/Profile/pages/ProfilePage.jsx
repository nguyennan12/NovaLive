import { Box, Container } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useConfirm } from 'material-ui-confirm'
import { logoutUserAPI, selectCurrentUser } from '~/store/user/userSlice'
import ActivityStatsCard from '../components/ProfilePage/ActivityStatsCard'
import PersonalInfoCard from '../components/ProfilePage/PersonalInfoCard'
import ProfileHeader from '../components/ProfilePage/ProfileHeader'
import SecurityCard from '../components/ProfilePage/SecurityCard'
import FullEditProfileDialog from '../components/ProfilePage/FullEditProfileDialog'
import { useOrderStats } from '../hooks/useOrderStats'
import { useProfile } from '../hooks/useProfile'
import { useProfileMutation } from '../hooks/useProfileMutation'

function ProfilePage() {
  const [isFullEditOpen, setIsFullEditOpen] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const isShop = !!currentUser?.user_shop

  const { profile, isLoading } = useProfile()
  const { updateProfile, isUpdating, changePassword, isChangingPassword } = useProfileMutation()
  const { totalOrders, totalSpent, pendingOrders, isLoading: statsLoading } = useOrderStats()
  const dispatch = useDispatch()
  const confirmDialog = useConfirm()

  const handleLogoutAll = async () => {
    const { confirmed } = await confirmDialog({
      title: 'Đăng xuất tất cả thiết bị?',
      description: 'Tất cả phiên đăng nhập hiện tại sẽ bị kết thúc. Bạn sẽ cần đăng nhập lại.',
      confirmationText: 'Đồng ý',
      cancellationText: 'Hủy'
    })
    if (confirmed) dispatch(logoutUserAPI())
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ pt: { xs: 1.5, sm: 3 }, pb: { xs: 10, sm: 8 }, px: 0, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <ProfileHeader
        profile={profile}
        isLoading={isLoading}
        isShop={isShop}
        onEditProfile={() => setIsFullEditOpen(true)}
        sx={{ mb: { xs: 2, sm: 2.5 } }}
      />

      {/* Stack all cards vertically */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, sm: 2.5 },
          width: '100%',
          alignItems: 'stretch'
        }}
      >
        <Box>
          <PersonalInfoCard
            profile={profile}
            isLoading={isLoading}
            onSave={updateProfile}
            isSaving={isUpdating}
          />
        </Box>
        <ActivityStatsCard
          totalOrders={totalOrders}
          totalSpent={totalSpent}
          pendingOrders={pendingOrders}
          isLoading={statsLoading}
          isShop={isShop}
        />
        <SecurityCard
          onChangePassword={changePassword}
          isChangingPassword={isChangingPassword}
          onLogoutAll={handleLogoutAll}
        />
      </Box>

      <FullEditProfileDialog
        open={isFullEditOpen}
        onClose={() => setIsFullEditOpen(false)}
        profile={profile}
        onSave={updateProfile}
        isSaving={isUpdating}
      />
    </Container>
  )
}

export default ProfilePage