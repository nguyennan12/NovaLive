import { useState, useEffect } from 'react'
import { Box, Typography, Pagination } from '@mui/material'
import ProductCard from './ProductCard'
import { queryProductAPI } from '~/common/apis/services/productService'
import { useQuery } from '@tanstack/react-query'
import { useFormContext, useWatch } from 'react-hook-form'
import { buildQueryParams } from '~/common/utils/builder'

const ProductList = () => {
  const [page, setPage] = useState(1)
  const limit = 8

  const { control } = useFormContext()
  const filters = useWatch({ control })

  const [debouncedKeyword, setDebouncedKeyword] = useState(filters?.keyword || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(filters?.keyword || '')
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [filters?.keyword])

  useEffect(() => {
    setPage(1)
  }, [filters?.category, filters?.status, filters?.stock, filters?.sort])

  const params = buildQueryParams(filters || {})
  params.page = page
  params.limit = limit
  if (debouncedKeyword) {
    params.keyword = debouncedKeyword
  }

  const queryString = new URLSearchParams(params).toString()
  const { data = [] } = useQuery({
    queryKey: ['products', queryString],
    queryFn: () => queryProductAPI(queryString)
  })


  const products = data?.products || []
  const totalPages = data?.totalPages || 1
  const totalItems = data?.totalItems || 0

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'primary.contrastText' }}>
          Product List
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'primary.contrastText', opacity: 0.45 }}>
          Showing {products.length} of {totalItems}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(auto-fill, minmax(150px, 1fr))',
            sm: 'repeat(auto-fill, 220px)'
          },
          gap: 1.5,
          width: '100%',
          justifyContent: 'center',
          maxHeight: 'calc(2 * 310px + 12px)',
          overflowY: 'auto',
          p: 1,
          scrollbarWidth: '-moz-initial',
          '&::-webkit-scrollbar': { width: '2px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#d1d5db', borderRadius: '4px' }
        }}
      >
        {products.map((product, i) => (
          <Box key={product.spu_code} >
            <ProductCard product={product} index={i} />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </>
  )
}

export default ProductList
