import { useState, useMemo } from 'react'
import { Box, Typography, TextField, Select, MenuItem, InputAdornment, Skeleton } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { PRODUCTS } from '../../../../../mockdata/stockdata'
import StatusBadge from '../shared/StatusBadge'
import EmptyState from '../shared/EmptyState'
import SectionCard from '../shared/SectionCard'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded'

const getStatus = (qty) => {
  if (qty <= 0) return 'out'
  if (qty <= 10) return 'low_stock'
  return 'in_stock'
}

const ProductStockList = ({ loading = false }) => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      const status = getStatus(p.stock)
      const matchFilter = filter === 'all' || status === filter
      return matchSearch && matchFilter
    })
  }, [search, filter])

  const selectSx = {
    fontSize: '0.78rem',
    height: 34,
    borderRadius: '8px',
    minWidth: 130,
    '& fieldset': { borderColor: '#eeeeee' },
    '&:hover fieldset': { borderColor: '#3485f7' },
    '&.Mui-focused fieldset': { borderColor: '#3485f7' }
  }

  return (
    <SectionCard
      title='Product Stock'
      subtitle={`${filtered.length} products`}
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size='small'
            placeholder='Search name / SKU...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchRoundedIcon sx={{ fontSize: 15, color: '#9ca3af' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': { fontSize: '0.78rem', height: 34, borderRadius: '8px', '& fieldset': { borderColor: '#eeeeee' } }
            }}
          />
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size='small'
            sx={selectSx}
          >
            <MenuItem value='all' sx={{ fontSize: '0.78rem' }}>All Status</MenuItem>
            <MenuItem value='in_stock' sx={{ fontSize: '0.78rem' }}>In Stock</MenuItem>
            <MenuItem value='low_stock' sx={{ fontSize: '0.78rem' }}>Low Stock</MenuItem>
            <MenuItem value='out' sx={{ fontSize: '0.78rem' }}>Out of Stock</MenuItem>
          </Select>
        </Box>
      }
    >
      {/* Table header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 1,
          px: 1.5,
          py: 1,
          bgcolor: '#f9fafb',
          borderRadius: '8px',
          mb: 1
        }}
      >
        {['Product', 'SKU', 'Stock', 'Status'].map((h) => (
          <Typography key={h} sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {h}
          </Typography>
        ))}
      </Box>

      {/* Rows */}
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 1, px: 1.5, py: 1.25, borderBottom: '1px solid #f3f4f6' }}>
            {[180, 90, 50, 80].map((w, j) => (
              <Skeleton key={j} variant='rounded' width={w} height={16} sx={{ borderRadius: '4px' }} />
            ))}
          </Box>
        ))
      ) : filtered.length === 0 ? (
        <EmptyState icon={InventoryRoundedIcon} title='No products found' subtitle='Try changing the filters' />
      ) : (
        filtered.map((p) => (
          <Box
            key={p.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: 1,
              px: 1.5,
              py: 1.25,
              borderBottom: '1px solid #f9fafb',
              borderRadius: '6px',
              transition: 'bgcolor 0.12s',
              '&:hover': { bgcolor: '#fafafa' }
            }}
          >
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#2d2d2d', lineHeight: 1.3 }}>
                {p.name}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>{p.brand}</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.78rem', color: '#6b7280', alignSelf: 'center', fontFamily: 'monospace' }}>
              {p.sku}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: p.stock <= 0 ? '#ef4444' : p.stock <= 10 ? '#f59e0b' : '#2d2d2d',
                alignSelf: 'center'
              }}
            >
              {p.stock}
            </Typography>
            <Box sx={{ alignSelf: 'center' }}>
              <StatusBadge qty={p.stock} />
            </Box>
          </Box>
        ))
      )}
    </SectionCard>
  )
}

export default ProductStockList