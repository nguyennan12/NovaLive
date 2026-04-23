import { Box, TextField, Select, MenuItem, InputAdornment, Typography } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'

const selectSx = {
  fontSize: '0.8rem',
  borderRadius: '8px',
  height: 36,
  minWidth: 130,
  color: 'primary.contrastText',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'divider',
    borderWidth: '1px !important'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'secondary.main' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'secondary.main' },
  '& .MuiSelect-icon': { color: 'primary.contrastText', opacity: 0.45 }
}

const menuItemSx = { fontSize: '0.8rem' }

const ProductFilterBar = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      mb: 2,
      flexWrap: 'wrap'
    }}
  >
    {/* Search */}
    <TextField
      placeholder='Search by name or SKU...'
      size='small'
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchRoundedIcon sx={{ fontSize: 16, color: 'primary.contrastText', opacity: 0.4 }} />
          </InputAdornment>
        )
      }}
      sx={{
        flex: 1,
        minWidth: 200,
        '& .MuiOutlinedInput-root': {
          height: 36,
          fontSize: '0.8rem',
          borderRadius: '8px',
          '& fieldset': { borderColor: 'divider' }
        },
        '& input': { color: 'primary.contrastText' },
        '& input::placeholder': { opacity: 0.4 }
      }}
    />

    {/* Divider label */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, opacity: 0.45 }}>
      <FilterListRoundedIcon sx={{ fontSize: 15, color: 'primary.contrastText' }} />
      <Typography sx={{ fontSize: '0.75rem', color: 'primary.contrastText', fontWeight: 500 }}>
        Filter
      </Typography>
    </Box>

    {/* Category */}
    <Select defaultValue='all' sx={selectSx}>
      <MenuItem value='all' sx={menuItemSx}>All Categories</MenuItem>
      <MenuItem value='clothing' sx={menuItemSx}>Clothing</MenuItem>
      <MenuItem value='electronics' sx={menuItemSx}>Electronics</MenuItem>
      <MenuItem value='accessories' sx={menuItemSx}>Accessories</MenuItem>
      <MenuItem value='food' sx={menuItemSx}>Food & Drink</MenuItem>
    </Select>

    {/* Stock status */}
    <Select defaultValue='all' sx={selectSx}>
      <MenuItem value='all' sx={menuItemSx}>All Stock</MenuItem>
      <MenuItem value='in' sx={menuItemSx}>In Stock</MenuItem>
      <MenuItem value='low' sx={menuItemSx}>Low Stock</MenuItem>
      <MenuItem value='out' sx={menuItemSx}>Out of Stock</MenuItem>
    </Select>

    {/* Discount */}
    <Select defaultValue='all' sx={selectSx}>
      <MenuItem value='all' sx={menuItemSx}>All Discounts</MenuItem>
      <MenuItem value='yes' sx={menuItemSx}>Has Discount</MenuItem>
      <MenuItem value='no' sx={menuItemSx}>No Discount</MenuItem>
    </Select>

    {/* Sort */}
    <Select defaultValue='newest' sx={{ ...selectSx, minWidth: 140 }}>
      <MenuItem value='newest' sx={menuItemSx}>Newest First</MenuItem>
      <MenuItem value='name_az' sx={menuItemSx}>Name A → Z</MenuItem>
      <MenuItem value='price_asc' sx={menuItemSx}>Price ↑</MenuItem>
      <MenuItem value='price_desc' sx={menuItemSx}>Price ↓</MenuItem>
    </Select>
  </Box>
)

export default ProductFilterBar