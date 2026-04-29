import { Box, Select, MenuItem, Typography } from '@mui/material'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { useSelector } from 'react-redux'
import { selectCategories } from '~/common/redux/product/categorySlice'

const selectSx = {
  fontSize: '0.8rem',
  borderRadius: '10px',
  height: 38,
  minWidth: 140,
  bgcolor: '#f5f5f5',
  color: 'primary.contrastText',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'secondary.main' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'secondary.main' },
  '& .MuiSelect-icon': { color: 'primary.contrastText', opacity: 0.4 }
}

const menuItemSx = { fontSize: '0.8rem' }

const HomeFilterBar = ({ filters, onFilterChange }) => {
  const categories = useSelector(selectCategories)

  return (
    <Box sx={{
      bgcolor: 'primary.main',
      borderRadius: { xs: '14px', sm: '16px' },
      px: { xs: 1.5, sm: 2, md: 2.5 },
      py: { xs: 1.25, sm: 1.5 },
      boxShadow: '0 1px 12px rgba(79,79,79,0.11)',
      my: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      flexWrap: 'wrap'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, opacity: 0.4, mr: 0.5 }}>
        <TuneRoundedIcon sx={{ fontSize: 15, color: 'primary.contrastText' }} />
        <Typography sx={{ fontSize: '0.75rem', color: 'primary.contrastText', fontWeight: 700 }}>Lọc</Typography>
      </Box>

      <Select
        value={filters.category}
        onChange={(e) => onFilterChange('category', e.target.value)}
        sx={selectSx}
        displayEmpty
      >
        <MenuItem value="all" sx={menuItemSx}>Tất cả danh mục</MenuItem>
        {categories?.map((cat) => (
          <MenuItem key={cat._id || cat.id} value={cat.cat_slug} sx={menuItemSx}>
            {cat.cat_name}
          </MenuItem>
        ))}
      </Select>

      <Select
        value={filters.sort}
        onChange={(e) => onFilterChange('sort', e.target.value)}
        sx={{ ...selectSx, minWidth: 165 }}
      >
        <MenuItem value="newest" sx={menuItemSx}>Mới nhất</MenuItem>
        <MenuItem value="price_asc" sx={menuItemSx}>Giá: Thấp → Cao</MenuItem>
        <MenuItem value="price_desc" sx={menuItemSx}>Giá: Cao → Thấp</MenuItem>
        <MenuItem value="name_az" sx={menuItemSx}>Tên A → Z</MenuItem>
      </Select>

      {filters.category !== 'all' && (
        <Box
          onClick={() => onFilterChange('category', 'all')}
          sx={{
            px: 1.25, py: 0.5, borderRadius: '8px',
            bgcolor: '#e6efff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 0.5,
            '&:hover': { bgcolor: '#d0e4ff' }
          }}
        >
          <Typography sx={{ fontSize: '0.72rem', color: 'secondary.main', fontWeight: 600 }}>
            {categories?.find(c => c.cat_slug === filters.category)?.cat_name || filters.category}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: 'secondary.main', lineHeight: 1 }}>×</Typography>
        </Box>
      )}
    </Box>
  )
}

export default HomeFilterBar
