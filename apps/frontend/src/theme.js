import { extendTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT = '60px'
const CHAT_INPUT_HEIGHT = '64px'
const MAIN_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT})`


const theme = extendTheme({
  app: {
    appBarHeight: APP_BAR_HEIGHT,
    chatInputHeight: CHAT_INPUT_HEIGHT,
    mainContentHeight: MAIN_CONTENT_HEIGHT
  },


  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#fafafa',
          contrastText: '#2d2d2d'
        },
        secondary: {
          main: '#539bffff',
          contrastText: '#e6efff'
        },
        third: {
          main: '#8b5cf6',
          contrastText: '#e6efff'
        },
        fourth: {
          main: '#f59e0b',
          contrastText: '#e6efff'
        },
        divider: '#eeeeee'
      }
    }
  },

  customStyles: {
    discountForm: {
      inputSx: {
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'secondary.main' },
          '&:hover fieldset': { borderColor: 'secondary.main' },
          '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
        },
        '& label.Mui-focused': { color: 'secondary.main' }
      },
      dateSx: {
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'secondary.main' },
          '&:hover fieldset': { borderColor: 'secondary.main' },
          '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
        },
        '& label.Mui-focused': { color: 'secondary.main' },
        '& input[type="date"]::-webkit-calendar-picker-indicator': { opacity: 0.4, cursor: 'pointer' },
        '& label': {
          background: '#fff',
          padding: '0 4px',
          marginLeft: '-2px',
          color: 'text.secondary',
          '&.Mui-focused': { color: 'secondary.main' }
        }
      },
      sectionLabel: {
        fontSize: '0.65rem',
        fontWeight: 800,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        color: 'text.secondary',
        mb: 0.5
      }
    }
  },
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