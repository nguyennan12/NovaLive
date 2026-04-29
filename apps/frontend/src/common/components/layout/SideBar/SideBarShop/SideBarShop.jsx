import { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded'
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded'
import { NAV_SECTIONS } from '~/common/configs/sidebar.config'
import SidebarSection from './components/SidebarSection'
import SidebarStoreSelect from './components/SidebarStoreSelect'
import SidebarProfile from './components/SidebarProfile'
import { useNavigate } from 'react-router-dom'

const SIDEBAR_EXPANDED = 240
const SIDEBAR_COLLAPSED = 60

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeKey, setActiveKey] = useState('dashboard')

  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED
  const navigate = useNavigate()
  const backHome = () => navigate('/')
  return (
    <Box
      component='nav'
      sx={{
        width,
        minWidth: width,
        height: '100%',
        bgcolor: 'primary.main',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        borderRadius: '12px'
      }}
    >
      {/* Header */}
      <Box
        onClick={backHome}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 1 : 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 56,
          cursor: 'pointer'
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Logo mark */}
            <Box
              sx={{
                width: 28,
                height: 28,
                bgcolor: 'secondary.main',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2px'
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '2px'
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: 'secondary.main',
                letterSpacing: '-0.02em'
              }}
            >
              Shopall
            </Typography>
          </Box>
        )}

        <IconButton
          size='small'
          onClick={() => setCollapsed((c) => !c)}
          sx={{
            color: 'primary.contrastText',
            opacity: 0.5,
            '&:hover': { opacity: 1, bgcolor: 'action.hover' }
          }}
        >
          {collapsed
            ? <KeyboardDoubleArrowRightRoundedIcon sx={{ fontSize: 16 }} />
            : <KeyboardDoubleArrowLeftRoundedIcon sx={{ fontSize: 16 }} />
          }
        </IconButton>
      </Box>

      {/* Store select */}
      <Box sx={{ px: collapsed ? 1 : 1.5, pt: 1.5, pb: 1 }}>
        {!collapsed && (
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 500,
              color: 'primary.contrastText',
              opacity: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              px: 0.5,
              mb: 0.75
            }}
          >
            Stores
          </Typography>
        )}
        <SidebarStoreSelect collapsed={collapsed} />
      </Box>

      {/* Nav sections */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: collapsed ? 1 : 1.5, py: 0.5 }}>
        {NAV_SECTIONS.map((section) => (
          <SidebarSection
            key={section.label}
            section={section}
            collapsed={collapsed}
            onItemClick={setActiveKey}
          />
        ))}
      </Box>

      {/* Profile */}
      <Box sx={{ px: collapsed ? 1 : 1.5, pb: 1.5 }}>
        <SidebarProfile
          activeKey={activeKey}
          collapsed={collapsed}
          onItemClick={setActiveKey}
        />
      </Box>
    </Box >
  )
}

export default Sidebar