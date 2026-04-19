import { extendTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT = '60px'
const CHAT_INPUT_HEIGHT = '64px'
const MAIN_STREAM_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT})`


const theme = extendTheme({
  livestreamLayout: {
    appBarHeight: APP_BAR_HEIGHT,
    chatInputHeight: CHAT_INPUT_HEIGHT,
    mainStreamHeight: MAIN_STREAM_HEIGHT
  },

  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#fafafa',
          contrastText: '#494949'
        },
        secondary: {
          main: '#3465c8',
          contrastText: '#ffffff'
        },
        divider: '#eeeeee'
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#222526',
          contrastText: '#fafafa'
        },
        secondary: {
          main: '#1f14b3',
          contrastText: '#ffffff'
        },
        divider: '#3b3b3b'
      }
    }
  },
  colorSchemeSelector: 'class',
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '6px',
            height: '6px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdc3c7',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'var(--mui-palette-secondary-main)'
          }
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: 'var(--mui-palette-primary-contrastText)',
          fontSize: '1rem',
          boxShadow: 'none',
          borderRadius: '8px',
          '&:hover': { boxShadow: 'none' }
        }
      }
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': { fontSize: '0.875rem' }
        }
      }
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--mui-palette-primary-contrastText)',
          fontSize: '0.875rem'
        }
      }
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& input': {
            color: 'var(--mui-palette-primary-contrastText)'
          },
          '& label.Mui-focused': {
            color: 'var(--mui-palette-primary-contrastText)'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'var(--mui-palette-secondary-main)'
            },
            '&:hover fieldset': {
              borderColor: 'var(--mui-palette-secondary-main)'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--mui-palette-secondary-main)'
            }
          }
        }
      }
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'var(--mui-palette-primary-contrastText)',
          color: 'var(--mui-palette-primary-main)',
          fontSize: '0.75rem',
          borderRadius: '6px',
          boxShadow: '0 0 3px rgba(0,0,0,0.15)',
          padding: '6px 12px'
        }
      }
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '40px'
        },
        indicator: {
          bottom: 0,
          height: 2,
          backgroundColor: 'var(--mui-palette-secondary-main)'
        }
      }
    },

    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: '40px',
          minWidth: 0,
          padding: '6px 12px',
          color: 'var(--mui-palette-primary-contrastText)',
          '&.Mui-selected .MuiSvgIcon-root': {
            color: 'var(--mui-palette-secondary-main) !important',
            fontWeight: 600
          },
          '&.Mui-selected .MuiTypography-root': {
            color: 'var(--mui-palette-secondary-main) !important',
            fontWeight: 600
          }
        }
      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          borderRadius: '8px',
          '& fieldset': { borderWidth: '0.5px !important' },
          '&:hover fieldset': { borderWidth: '1px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1px !important' }
        }
      }
    }
  }
})

export default theme