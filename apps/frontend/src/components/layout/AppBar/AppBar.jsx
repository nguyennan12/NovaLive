import ClearIcon from '@mui/icons-material/Clear'
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment } from '@mui/material'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import Chip from '@mui/material/Chip'
import Profiles from './Menu/Profile'
import { useColorScheme } from '@mui/material/styles'
import ChangeTheme from '~/components/common/switch/changeTheme'


function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  const { mode } = useColorScheme()
  return (
    <Box sx={{
      height: (theme) => theme.app.appBarHeight,
      width: '100%',
      p: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'primary.main'
    }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Typography sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #3465c8, #69aedc, #8acdde)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }} variant='h6'>CodeSpaces</Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <Button variant='text'>Home</Button>
          <Button variant='text'>Problems</Button>
          <Button variant='text'>Course</Button>
          <Button variant='text'>Blog</Button>
          <Chip label="Premium" sx={{
            color: 'secondary.main',
            px: 1,
            fontWeight: 'bold',
            backgroundColor:
              mode === 'dark'
                ? 'rgba(134, 245, 134, 0.3)'
                : 'rgba(154, 185, 247, 0.3)'

          }} />
        </ Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          id="outlined-search"
          label="Search"
          type="text"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          slotProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'secondary.main' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                <ClearIcon
                  sx={{
                    color: searchValue ? 'primary.contrastText' : 'transparent',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => { setSearchValue('') }}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '100px',
            display: { xs: 'none', md: 'flex' }
          }} />

        <ChangeTheme />

        <Tooltip title="Notifications">
          <Badge color="secondary" variant="dot">
            <NotificationsNoneIcon sx={{ color: 'primary.contrastText' }} />
          </Badge>
        </Tooltip>

        <Tooltip title="Streaks">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Badge color="secondary">
              <LocalFireDepartmentOutlinedIcon size='middle' sx={{ color: 'primary.contrastText' }} />
            </Badge>
            <Typography variant='b1'>0</Typography>
          </Box>

        </Tooltip>

        <Profiles />
      </Box>

    </Box >
  )
}

export default AppBar