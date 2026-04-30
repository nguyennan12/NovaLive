import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteScroll } from '~/common/hooks/useScroll'
import { selectCategories } from '~/common/redux/product/categorySlice'
import { DEFAULT_FILTERS } from '~/common/utils/constant'
import HomeFilterBar from '~/features/Home/components/HomeFilterBar'
import ProductGridSection from '~/features/Home/components/ProductGridSection'
import { useHomeProducts } from '~/features/Home/hooks/useHomeProducts'


const ProductsListPage = () => {
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get('category') || ''
  const keyword = searchParams.get('keyword') || ''

  const categories = useSelector(selectCategories)
  const categoryName = useMemo(() => {
    const found = (categories || []).find(c => c.cat_slug === categorySlug)
    return found?.cat_name ?? categorySlug
  }, [categories, categorySlug])

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: categorySlug,
      keyword: keyword
    }))
  }, [categorySlug, keyword])

  const { isFiltering, filteredProducts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useHomeProducts(filters)
  const lastProductRef = useInfiniteScroll({ isFiltering, isFetchingNextPage, hasNextPage, fetchNextPage })

  return (
    <Box sx={{
      maxWidth: 1440,
      mx: 'auto',
      px: { xs: 1.5, sm: 2.5, md: 4, lg: 5 },
      pt: { xs: 2, md: 3 },
      pb: { xs: '100px', sm: '110px' },
      minHeight: '100vh',
      background: 'transparent'
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GridViewRoundedIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
          <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: 'primary.contrastText' }}>
            {categoryName}
          </Typography>
          {!isLoading && (
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', ml: 0.5 }}>
              ({filteredProducts.length} sản phẩm)
            </Typography>
          )}
        </Box>
      </Box>

      <HomeFilterBar filters={filters} onFilterChange={handleFilterChange} />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ProductGridSection
          products={filteredProducts}
          isLoading={false}
          lastItemRef={lastProductRef}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </Box>
  )
}

export default ProductsListPage
