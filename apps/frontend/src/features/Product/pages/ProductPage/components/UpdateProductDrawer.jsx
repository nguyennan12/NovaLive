import {
  Drawer, Box, Typography, TextField, Button,
  Select, MenuItem, InputLabel, FormControl, Divider, IconButton
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontSize: '0.85rem',
    borderRadius: '8px',
    color: 'primary.contrastText',
    '& fieldset': { borderColor: 'divider' },
    '&:hover fieldset': { borderColor: 'secondary.main' },
    '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
  },
  '& label': { fontSize: '0.8rem', color: 'primary.contrastText' },
  '& label.Mui-focused': { color: 'secondary.main' }
}

const UpdateProductDrawer = ({ open, onClose, product }) => (
  <Drawer
    anchor='right'
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        width: { xs: '100%', sm: 400 },
        bgcolor: 'primary.main',
        p: 0,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.08)'
      }
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'primary.contrastText' }}>
          Update Product
        </Typography>
        {product && (
          <Typography sx={{ fontSize: '0.72rem', color: 'primary.contrastText', opacity: 0.4, mt: 0.2 }}>
            {product.name}
          </Typography>
        )}
      </Box>
      <IconButton
        size='small'
        onClick={onClose}
        sx={{ color: 'primary.contrastText', opacity: 0.5, '&:hover': { opacity: 1 } }}
      >
        <CloseRoundedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>

    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, overflowY: 'auto', flex: 1 }}>


      <TextField
        key={`name-${product?.id}`}
        label='Product Name'
        placeholder='e.g. Classic White Tee'
        fullWidth
        size='small'
        defaultValue={product?.name || ''}
        sx={fieldSx}
      />
      <TextField
        key={`price-${product?.id}`}
        label='Price ($)'
        placeholder='0.00'
        fullWidth
        size='small'
        type='number'
        defaultValue={product?.price || ''}
        sx={fieldSx}
      />
      <TextField
        label='Stock Quantity'
        placeholder='0'
        fullWidth
        size='small'
        type='number'
        sx={fieldSx}
      />

      <FormControl size='small' fullWidth>
        <InputLabel
          sx={{ fontSize: '0.8rem', color: 'primary.contrastText', '&.Mui-focused': { color: 'secondary.main' } }}
        >
          Category
        </InputLabel>
        <Select
          label='Category'
          defaultValue={product?.category?.toLowerCase() || ''}
          key={`cat-${product?.id}`}
          sx={{
            fontSize: '0.85rem',
            borderRadius: '8px',
            color: 'primary.contrastText',
            '& fieldset': { borderColor: 'divider' },
            '&:hover fieldset': { borderColor: 'secondary.main' },
            '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
          }}
        >
          <MenuItem value='clothing' sx={{ fontSize: '0.85rem' }}>Clothing</MenuItem>
          <MenuItem value='electronics' sx={{ fontSize: '0.85rem' }}>Electronics</MenuItem>
          <MenuItem value='accessories' sx={{ fontSize: '0.85rem' }}>Accessories</MenuItem>
          <MenuItem value='footwear' sx={{ fontSize: '0.85rem' }}>Footwear</MenuItem>
          <MenuItem value='lifestyle' sx={{ fontSize: '0.85rem' }}>Lifestyle</MenuItem>
        </Select>
      </FormControl>
    </Box>

    <Divider />
    <Box sx={{ display: 'flex', gap: 1.5, p: 3 }}>
      <Button
        fullWidth
        variant='outlined'
        sx={{
          fontSize: '0.85rem',
          fontWeight: 600,
          borderRadius: '8px',
          borderColor: 'divider',
          color: 'primary.contrastText',
          '&:hover': { borderColor: 'primary.contrastText' }
        }}
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        fullWidth
        variant='contained'
        sx={{
          fontSize: '0.85rem',
          fontWeight: 600,
          borderRadius: '8px',
          background: 'linear-gradient(90deg, #4c83f0, #69aedc, #8acdde)',
          color: '#fff'
        }}
      >
        Save
      </Button>
    </Box>
  </Drawer>
)

export default UpdateProductDrawer