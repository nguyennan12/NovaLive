import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import { Box, Divider } from '@mui/material'
import { useCallback, useState } from 'react'
import { BannerHomePage, PosterFirst } from '../components/BannerHomePage'
import CategorySection from '../components/CategorySection'
import HomeFilterBar from '../components/HomeFilterBar'
import ProductBestSellerSection from '../components/ProductBestSellerSection'
import ProductGridSection from '../components/ProductGridSection'
import ProductScrollSection from '../components/ProductScrollSection'
import { useHomeProducts } from '../hooks/useHomeProducts'

const DEFAULT_FILTERS = { priceRange: [0, 50_000_000], sort: 'newest' }

export const HomePage = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const {
    isFiltering,
    filteredProducts, filterLoading,
    featuredProducts, bestSellers, newArrivals,
    isLoading
  } = useHomeProducts(filters)

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
      <BannerHomePage />

      <CategorySection onCategorySelect={() => { }} />

      <Divider sx={{ mb: { xs: 2, md: 3 }, opacity: 0.4 }} />

      <ProductScrollSection products={featuredProducts} isLoading={isLoading} />

      <ProductBestSellerSection products={bestSellers} isLoading={isLoading} />

      <PosterFirst />

      {/* FilterBar luôn hiện để user có thể thay đổi filter */}
      <HomeFilterBar filters={filters} onFilterChange={handleFilterChange} />

      {isFiltering ? (
        <ProductGridSection
          title="Kết quả lọc"
          subtitle={!filterLoading && filteredProducts.length > 0
            ? `${filteredProducts.length} sản phẩm`
            : undefined}
          icon={<GridViewRoundedIcon sx={{ fontSize: 18, color: 'secondary.main' }} />}
          accent="#3485f7"
          products={filteredProducts}
          isLoading={filterLoading}
          hideSeeMore
        />
      ) : (
        <ProductGridSection products={newArrivals} isLoading={isLoading} />
      )}
    </Box>
  )
}
