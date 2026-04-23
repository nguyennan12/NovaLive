import { useState } from 'react'
import { Box, Typography, Pagination } from '@mui/material'
import ProductCard from './ProductCard'
import { getAllProductsAPI } from '~/common/apis/services/productService'
import { useQuery } from '@tanstack/react-query'


const ProductList = () => {

  const [page, setPage] = useState(1)
  const limit = 8

  const { data = [] } = useQuery({
    queryKey: ['products', page],
    queryFn: () => getAllProductsAPI({ page, limit })
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