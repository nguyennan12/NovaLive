import { useState, useMemo } from 'react'
import { Box, Typography, TextField, Select, MenuItem, InputAdornment, Skeleton, Pagination } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { PRODUCTS } from '../../../../../mockdata/stockdata'
import StatusBadge from '../shared/StatusBadge'
import EmptyState from '../shared/EmptyState'
import SectionCard from '../shared/SectionCard'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded'
import { useQuery } from '@tanstack/react-query'
import { getAllSkuAPI } from '~/common/apis/services/productService'

const getStatus = (qty) => {
  if (qty <= 0) return 'out'
  if (qty <= 10) return 'low_stock'
  return 'in_stock'
}

const ProductStockList = ({ loading = false }) => {
  const limit = 10
  const [page, setPage] = useState(1)

  const { data = [] } = useQuery({
    queryKey: ['skus', page],
    queryFn: () => getAllSkuAPI({ limit, page })
  })
  const skus = data?.items || []
  const totalPages = data?.totalPages || 1

  const handlePageChange = (event, value) => {
    setPage(value)
  }
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const flattenedSkus = useMemo(() => {
    const list = []
    skus.forEach(spu => {
      if (spu.has_variations && spu.variation_stocks?.length > 0) {
        spu.variation_stocks.forEach(sku => {
          list.push({
            id: sku.sku_id,
            spu_id: spu._id,
            spu_name: spu.spu_name,
            spu_code: spu.spu_code,
            sku_name: sku.sku_name || Object.values(sku.attributes || {}).join(' - ') || 'Variation',
            sku_code: sku.sku_code,
            stock: sku.stock,
            attributes: sku.attributes
          })
        })
      } else {
        list.push({
          id: spu._id,
          spu_id: spu._id,
          spu_name: spu.spu_name,
          spu_code: spu.spu_code,
          sku_name: 'No variation',
          sku_code: 'N/A',
          stock: spu.total_stock,
          attributes: []
        })
      }
    })
    return list
  }, [skus])

  const filtered = useMemo(() => {
    return flattenedSkus.filter((p) => {
      const matchSearch = p.spu_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.spu_code?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku_name?.toLowerCase().includes(search.toLowerCase())
      const status = getStatus(p.stock)
      const matchFilter = filter === 'all' || status === filter
      return matchSearch && matchFilter
    })
  }, [flattenedSkus, search, filter])

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
        filtered.map((p) => {
          return <Box
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
                {p.spu_name}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>{p.sku_name}</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.78rem', color: '#6b7280', alignSelf: 'center', fontFamily: 'monospace' }}>
              {p.sku_code !== 'N/A' ? p.sku_code : p.spu_code}
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
          </Box>;
        })
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

    </SectionCard>
  )
}

export default ProductStockList