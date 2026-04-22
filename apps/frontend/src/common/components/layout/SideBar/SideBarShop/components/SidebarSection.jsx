import { Box, Typography } from '@mui/material'
import SidebarNavItem from './SidebarNavItem'

const SidebarSection = ({ section, activeKey, collapsed, onItemClick }) => (
  <Box sx={{ mb: 1 }}>
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
        {section.label}
      </Typography>
    )}

    {collapsed && (
      <Box sx={{ height: '1px', bgcolor: 'divider', mx: 1, mb: 1, opacity: 0.6 }} />
    )}

    {section.items.map((item) => (
      <SidebarNavItem
        key={item.key}
        item={item}
        active={activeKey === item.key}
        collapsed={collapsed}
        onClick={onItemClick}
      />
    ))}
  </Box>
)

export default SidebarSection