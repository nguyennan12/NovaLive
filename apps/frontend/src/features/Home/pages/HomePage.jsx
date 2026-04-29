import styled from '@emotion/styled'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import { Box, Divider } from '@mui/material'
import { useCallback, useState } from 'react'
import { BannerHomePage, PosterFirst } from '../components/BannerHomePage'
import CategorySection from '../components/CategorySection'
import HomeFilterBar from '../components/HomeSearchBar'
import ProductBestSellerSection from '../components/ProductBestSellerSection'
import ProductGridSection from '../components/ProductGridSection'
import ProductScrollSection from '../components/ProductScrollSection'
import { useHomeProducts } from '../hooks/useHomeProducts'
import { WaterDropBackground } from '~/common/components/common/style/WaterDropBackground'

const DEFAULT_FILTERS = { category: 'all', sort: 'newest' }

export const HomePage = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleCategorySelect = useCallback((slug) => {
    setFilters(prev => ({ ...prev, category: slug }))
  }, [])

  const {
    isFiltering,
    filteredProducts, filterLoading,
    featuredProducts, bestSellers, newArrivals,
    isLoading
  } = useHomeProducts(filters)

  return (
    <WaterDropBackground>

      <Box sx={{
        maxWidth: 1440,
        mx: 'auto',
        px: { xs: 1.5, sm: 2.5, md: 4, lg: 5 },
        py: { xs: 2, md: 3 },
        minHeight: '100vh',
        background: 'transperent'
      }}>
        <BannerHomePage />

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
          <>
            <CategorySection onCategorySelect={handleCategorySelect} />

            <Divider sx={{ mb: { xs: 3, md: 4 }, opacity: 0.4 }} />

            <ProductScrollSection products={featuredProducts} isLoading={isLoading} />

            <ProductBestSellerSection products={bestSellers} isLoading={isLoading} />

            < PosterFirst />
            <HomeFilterBar filters={filters} onFilterChange={handleFilterChange} />

            <ProductGridSection products={newArrivals} isLoading={isLoading}
            />
          </>
        )}
      </Box>
    </WaterDropBackground>

  )
}
