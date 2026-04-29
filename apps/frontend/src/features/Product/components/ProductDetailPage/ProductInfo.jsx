import ShoppingBasketRoundedIcon from '@mui/icons-material/ShoppingBasketRounded'
import { Box, Chip, Divider, Rating, Skeleton, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectCategories } from '~/common/redux/product/categorySlice'
import { formatSold, formatVND } from '~/common/utils/formatters'
import ProductAttributesTable from './ProductAttributesTable'

const stockColor = (stock) => {
  if (stock === 0) return '#ef4444'
  if (stock <= 10) return '#f59e0b'
  return '#22c55e'
}

const stockLabel = (stock) => {
  if (stock === 0) return 'Hết hàng'
  if (stock <= 10) return `Còn ${stock} sản phẩm`
  return `Còn hàng (${stock})`
}

const ProductInfo = ({ product, selectedSku }) => {
  const categories = useSelector(selectCategories)

  if (!product) {
    return (
      <Box>
        <Skeleton variant="text" width="75%" height={40} />
        <Skeleton variant="text" width="45%" height={24} sx={{ mt: 0.75 }} />
        <Skeleton variant="rounded" height={80} sx={{ mt: 2, borderRadius: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: '8px' }} />
        </Box>
      </Box>
    )
  }

  const displayPrice = selectedSku?.sku_price ?? product.spu_price
  const displayStock = selectedSku?.sku_stock ?? product.spu_quantity

  // Resolve category IDs to names using the Redux store
  const categoryChips = (product.spu_category ?? []).map((catId) => {
    const found = categories.find((c) => c._id === catId || c.cat_id === catId)
    return { id: catId, label: found?.cat_name ?? catId.slice(-6) }
  })

  return (
    <Box>
      {/* Product name */}
      <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.contrastText', lineHeight: 1.3 }}>
        {product.spu_name}
      </Typography>

      {/* Rating + sold row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1, flexWrap: 'wrap' }}>
        <Rating
          value={product.spu_ratingsAvg ?? 0}
          precision={0.5}
          readOnly
          size="small"
          sx={{ color: 'fourth.main' }}
        />
        <Typography sx={{ fontSize: '0.82rem', color: 'fourth.main', fontWeight: 600 }}>
          {(product.spu_ratingsAvg ?? 0).toFixed(1)}
        </Typography>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#e0e0e0' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
          <ShoppingBasketRoundedIcon sx={{ fontSize: 13, color: '#aaa' }} />
          <Typography sx={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 500 }}>
            {formatSold(product.total_sold ?? 0)} lượt mua
          </Typography>
        </Box>
      </Box>

      {/* Price block */}
      <Box sx={{
        mt: 2.5,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 2,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        p: 2
      }}>
        <Typography sx={{
          fontSize: { xs: '1.75rem', md: '2rem' },
          fontWeight: 900,
          color: 'secondary.main',
          letterSpacing: '-0.02em',
          lineHeight: 1
        }}>
          {formatVND(displayPrice ?? 0)}
        </Typography>
        <Typography sx={{
          fontSize: '0.78rem',
          fontWeight: 600,
          color: stockColor(displayStock ?? 0),
          mt: 0.75
        }}>
          {stockLabel(displayStock ?? 0)}
        </Typography>
      </Box>

      {/* Category chips */}
      {categoryChips.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 2 }}>
          {categoryChips.map(({ id, label }) => (
            <Chip
              key={id}
              label={label}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'secondary.main',
                color: 'secondary.main',
                fontSize: '0.72rem',
                borderRadius: '8px',
                fontWeight: 600
              }}
            />
          ))}
        </Box>
      )}
      <ProductAttributesTable />
    </Box>
  )
}

export default ProductInfo
