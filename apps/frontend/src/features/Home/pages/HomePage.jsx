import { useState, useCallback } from 'react'
import { Box, Typography, Divider } from '@mui/material'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import HomeFilterBar from '../components/HomeSearchBar'
import CategorySection from '../components/CategorySection'
import ProductScrollSection from '../components/ProductScrollSection'
import ProductBestSellerSection from '../components/ProductBestSellerSection'
import ProductGridSection from '../components/ProductGridSection'
import { useHomeProducts } from '../hooks/useHomeProducts'
import { PosterFirst, PosterSecond, BannerHomePage } from '../components/BannerHomePage'
import styled from '@emotion/styled'

const DEFAULT_FILTERS = { category: 'all', sort: 'newest' }


const WaterDropBackground = styled(Box)({
  maxWidth: 1440,
  margin: '0 auto',
  padding: '12px 16px', // Tương đương { xs: 1.5, sm: 2 } trong MUI
  minHeight: '100vh',
  // Gradient nền cơ bản
  background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #f5f8ff 100%)',
  position: 'relative',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(https://res.cloudinary.com/nguyennan12/image/upload/v1777390530/Livestream-ecommerce/ax1bdij6pu7lkcwmeui5.jpg)',
    backgroundSize: 'cover',
    opacity: 0.6,
    zIndex: 0
  },


  '& > *': {
    position: 'relative',
    zIndex: 1
  }
})

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
          <>
            <CategorySection onCategorySelect={handleCategorySelect} />

            <Divider sx={{ mb: { xs: 3, md: 4 }, opacity: 0.4 }} />

            <ProductScrollSection products={featuredProducts} isLoading={isLoading} />

            <ProductBestSellerSection products={bestSellers} isLoading={isLoading} />

            < PosterFirst />

            <ProductGridSection products={newArrivals} isLoading={isLoading}
            />
          </>
        )}
      </Box>
    </WaterDropBackground>

  )
}
