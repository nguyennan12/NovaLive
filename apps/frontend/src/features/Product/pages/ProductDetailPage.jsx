import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded'
import ShoppingBasketRoundedIcon from '@mui/icons-material/ShoppingBasketRounded'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { Box, Button, Chip, Divider, Grid, Rating, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PageSkeleton } from '~/common/components/common/loading/PageSkeleton'
import { WaterDropBackground } from '~/common/components/common/style/WaterDropBackground'
import { selectCategories } from '~/common/redux/product/categorySlice'
import { slugCateToNameCate } from '~/common/utils/converter'
import { formatSold } from '~/common/utils/formatters'
import ProductGridSection from '~/features/Home/components/ProductGridSection'
import { glassSx } from '~/theme'
import ProductAttributesTable from '../components/ProductDetailPage/ProductAttributesTable'
import { ProductDescription } from '../components/ProductDetailPage/ProductDescription'
import ProductImageGallery from '../components/ProductDetailPage/ProductImageGallery'
import ProductVariantSelector, { SkuPriceLine } from '../components/ProductDetailPage/ProductVariantSelector'
import ShopInfoCard from '../components/ProductDetailPage/ShopInfoCard'
import { useProduct } from '../hooks/useProduct'
import { useProductDetail } from '../hooks/useProductDetail'


const ProductDetailPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const categories = useSelector(selectCategories)
  const { data: product, isLoading, isError, error } = useProductDetail(productId)

  const [selectedSkuId, setSelectedSkuId] = useState(null)
  //có thể làm 1 API get product Similar
  const { products } = useProduct()

  useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message ?? 'Không tìm thấy sản phẩm')
      navigate(-1)
    }
  }, [isError, error, navigate])

  const skuList = product?.sku_list ?? []
  const selectedSku = skuList.find((s) => s.sku_id === selectedSkuId)
    ?? skuList.find((s) => s.sku_default)
    ?? skuList[0]
    ?? null
  const attributes = product?.spu_attributes ?? []
  const categoryChips = slugCateToNameCate(product?.spu_category, categories)

  return (
    <WaterDropBackground>
      <Box sx={{ px: { xs: 1.5, sm: 2.5, md: 4 }, py: { xs: 2, md: 3 } }}>

        {isLoading ? <PageSkeleton /> : (
          <Grid container spacing={2.5}>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ p: 2, bgcolor: 'primary.main', ...glassSx, borderRadius: '12px' }}>
                  <ProductImageGallery thumbUrl={product?.spu_thumb} productName={product?.spu_name} />
                </Box>


              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'primary.main', ...glassSx, borderRadius: '12px', height: '100%', justifyContent: 'space-between' }}>

                {/*  name, rating, sold, categories */}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.contrastText', lineHeight: 1.3 }}>
                    {product?.spu_name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={product?.spu_ratingsAvg ?? 0} precision={0.5} readOnly size="small" sx={{ color: 'fourth.main' }} />
                      <Typography sx={{ fontSize: '0.82rem', color: 'fourth.main', fontWeight: 700 }}>
                        {(product?.spu_ratingsAvg ?? 0).toFixed(1)}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: '#e0e0e0' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <ShoppingBasketRoundedIcon sx={{ fontSize: 13, color: '#aaa' }} />
                      <Typography sx={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 500 }}>
                        {formatSold(product?.total_sold ?? 0)} lượt mua
                      </Typography>
                    </Box>


                  </Box>
                  {categoryChips.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
                      {categoryChips.map(({ id, label }) => (
                        <Chip key={id} label={label} size="small" variant="outlined" sx={{
                          borderColor: 'secondary.main', color: 'secondary.main',
                          fontSize: '0.72rem', borderRadius: '8px', fontWeight: 600
                        }} />
                      ))}
                    </Box>
                  )}
                </Box>
                {/* Price + action buttons */}
                <Box >
                  {skuList.length > 0 && (
                    <Box >
                      <ProductVariantSelector
                        skuList={skuList}
                        selectedSkuId={selectedSkuId}
                        onSelect={setSelectedSkuId}
                        thumbFallback={product?.spu_thumb}
                      />
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 500 }}>
                      Phân loại: <strong style={{ color: '#555' }}>{selectedSku?.sku_name ?? '—'}</strong>
                    </Typography>
                  </Box>
                  <SkuPriceLine selectedSku={selectedSku} basePrice={product?.spu_price} />

                  <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                    <Button
                      variant="outlined" fullWidth
                      startIcon={<ShoppingCartOutlinedIcon />}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        textTransform: 'none', fontWeight: 700, fontSize: '0.9rem',
                        borderRadius: '12px', py: 1.25,
                        borderColor: 'secondary.main', color: 'secondary.main',
                        '&:hover': { bgcolor: 'rgba(52,133,247,0.06)' }
                      }}
                    >
                      Giỏ hàng
                    </Button>
                    <Button
                      variant="contained" fullWidth
                      startIcon={<LocalMallRoundedIcon />}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        textTransform: 'none', fontWeight: 700, fontSize: '0.9rem',
                        borderRadius: '12px', py: 1.25,
                        bgcolor: 'secondary.main',
                        background: 'linear-gradient(90deg, #568dfbff, #69aedc, #8acdde)',
                        color: '#ffffff',
                        '&:hover': { bgcolor: '#4e96f6ff', boxShadow: '0 6px 20px rgba(52,133,247,0.45)' }
                      }}
                    >
                      Mua ngay
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>


            {/* DESCRIPTION + ATTRIBUTE */}
            <Grid container size={12} spacing={2} sx={{ mt: 2 }}>
              {product?.spu_description && (
                <Grid size={{ xs: 12, md: 7 }} >
                  <ProductDescription text={product.spu_description} sx={{ height: '100%' }} />
                </Grid>
              )}

              {attributes.length > 0 && (
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ bgcolor: 'primary.main', ...glassSx }}>
                    <ProductAttributesTable attributes={attributes} />
                  </Box>
                </Grid>
              )}
            </Grid>

            <Grid size={12}>
              <ShopInfoCard shopId={product?.spu_shopId} />
            </Grid>

            {/* Other Product */}
            <Box sx={{ alignContent: 'center', width: '100vw' }}>
              <Typography >Có thể bạn thích</Typography>
            </Box>
            <Grid size={12}>
              <ProductGridSection products={products} isLoading={isLoading} />
            </Grid>

          </Grid>
        )}
      </Box>
    </WaterDropBackground >
  )
}

export default ProductDetailPage
