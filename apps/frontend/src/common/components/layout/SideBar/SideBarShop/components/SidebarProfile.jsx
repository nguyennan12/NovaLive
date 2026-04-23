import { Box, Avatar, Typography } from '@mui/material'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import SidebarNavItem from './SidebarNavItem'
import { PROFILE_ITEMS } from '~/common/configs/sidebar.config'

const SidebarProfile = ({ activeKey, collapsed, onItemClick }) => (
  <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
    {!collapsed && (
      <Typography
        sx={{
          fontSize: '0.7rem',
          fontWeight: 500,
          color: 'primary.contrastText',
          opacity: 0.5,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          px: 1.5,
          mb: 0.5
        }}
      >
        Profile
      </Typography>
    )}

    {PROFILE_ITEMS.map((item) => (
      <SidebarNavItem
        key={item.key}
        item={item}
        active={activeKey === item.key}
        collapsed={collapsed}
        onClick={onItemClick}
      />
    ))}
    {/* User info */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 1,
        px: collapsed ? 0 : 1,
        py: 1,
        mt: 0.5,
        borderRadius: '8px',
        cursor: 'pointer',
        justifyContent: collapsed ? 'center' : 'space-between',
        '&:hover': { bgcolor: 'action.hover' }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          src='/avatar.jpg'
          sx={{ width: 30, height: 30, flexShrink: 0 }}
        />
        {!collapsed && (
          <Box>
            <Typography
              sx={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'primary.contrastText',
                lineHeight: 1.3
              }}
            >
              Hecham GAZHI
            </Typography>
            <Typography
              sx={{
                fontSize: '0.7rem',
                color: 'primary.contrastText',
                opacity: 0.5,
                lineHeight: 1.3
              }}
            >
              hechamgazhi@gmail.com
            </Typography>
          </Box>
        )}
      </Box>
      {!collapsed && (
        <KeyboardArrowDownRoundedIcon
          sx={{ fontSize: 16, color: 'primary.contrastText', opacity: 0.5 }}
        />
      )}
    </Box>

  </Box>
)

export default SidebarProfile