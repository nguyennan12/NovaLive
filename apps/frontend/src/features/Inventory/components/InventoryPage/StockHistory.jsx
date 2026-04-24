import { useState, useMemo } from 'react'
import {
  Box, Typography, TextField, Select, MenuItem,
  InputAdornment, Skeleton
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import { STOCK_HISTORY } from '../../../../../mockdata/stockdata'
import StatusBadge from '../shared/StatusBadge'
import EmptyState from '../shared/EmptyState'
import SectionCard from '../shared/SectionCard'

const fmt = (iso) => {
  const d = new Date(iso)
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const COLS = ['Type', 'Product', 'SKU', 'Qty', 'Time', 'User', 'Note']
const GRID = '80px 2fr 1fr 60px 1.2fr 1.5fr 2fr'

const StockHistory = ({ loading = false }) => {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = useMemo(() =>
    STOCK_HISTORY.filter((h) => {
      const matchSearch = h.productName.toLowerCase().includes(search.toLowerCase()) ||
        h.sku.toLowerCase().includes(search.toLowerCase()) ||
        h.user.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'all' || h.type === typeFilter
      return matchSearch && matchType
    }), [search, typeFilter])

  return (
    <SectionCard
      title='Stock History'
      subtitle={`${filtered.length} records`}
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size='small'
            placeholder='Search product, user...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ fontSize: 15, color: '#9ca3af' }} />
                  </InputAdornment>
                )
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.78rem', height: 34, borderRadius: '8px',
                '& fieldset': { borderColor: '#eeeeee' }
              }
            }}
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            size='small'
            sx={{
              fontSize: '0.78rem', height: 34, borderRadius: '8px', minWidth: 110,
              '& fieldset': { borderColor: '#eeeeee' }
            }}
          >
            <MenuItem value='all' sx={{ fontSize: '0.78rem' }}>All Types</MenuItem>
            <MenuItem value='IN' sx={{ fontSize: '0.78rem' }}>Stock In</MenuItem>
            <MenuItem value='OUT' sx={{ fontSize: '0.78rem' }}>Stock Out</MenuItem>
          </Select>
        </Box>
      }
    >
      {/* Header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: GRID,
          gap: 1,
          px: 1.5,
          py: 1,
          bgcolor: '#f9fafb',
          borderRadius: '8px',
          mb: 1
        }}
      >
        {COLS.map((c) => (
          <Typography key={c} sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {c}
          </Typography>
        ))}
      </Box>

      {/* Rows */}
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Box key={i} sx={{ display: 'grid', gridTemplateColumns: GRID, gap: 1, px: 1.5, py: 1.25, borderBottom: '1px solid #f3f4f6' }}>
            {[60, 160, 90, 40, 100, 130, 140].map((w, j) => (
              <Skeleton key={j} variant='rounded' width={w} height={14} sx={{ borderRadius: '4px' }} />
            ))}
          </Box>
        ))
      ) : filtered.length === 0 ? (
        <EmptyState icon={HistoryRoundedIcon} title='No history found' subtitle='Adjust filters to see results' />
      ) : (
        filtered.map((h) => (
          <Box
            key={h.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: GRID,
              gap: 1,
              px: 1.5,
              py: 1.25,
              borderBottom: '1px solid #f9fafb',
              borderRadius: '6px',
              alignItems: 'center',
              transition: 'bgcolor 0.12s',
              '&:hover': { bgcolor: '#fafafa' }
            }}
          >
            <StatusBadge type={h.type} />

            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2d2d2d', lineHeight: 1.3 }} noWrap>
                {h.productName}
              </Typography>
            </Box>

            <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'monospace' }}>
              {h.sku}
            </Typography>

            <Typography
              sx={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: h.type === 'IN' ? 'secondary.main' : 'third.main',
                letterSpacing: '-0.02em'
              }}
            >
              {h.type === 'IN' ? '+' : '-'}{h.qty}
            </Typography>

            <Typography sx={{ fontSize: '0.72rem', color: '#6b7280' }}>{fmt(h.time)}</Typography>

            <Typography sx={{ fontSize: '0.72rem', color: '#6b7280' }} noWrap>{h.user}</Typography>

            <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }} noWrap>{h.note || '—'}</Typography>
          </Box>
        ))
      )}
    </SectionCard>
  )
}

export default StockHistory