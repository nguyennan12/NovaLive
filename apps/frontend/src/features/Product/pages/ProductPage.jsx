import { Box, Typography } from '@mui/material'
import ProductActionCards from '../components/ProductPage/ProductActionCards'
import ProductFilterBar from '../components/ProductPage/ProductFilterBar'
import ProductList from '../components/ProductPage/ProductList'
import { FormProvider, useForm } from 'react-hook-form'

const ProductsPage = () => {
  const methods = useForm({
    defaultValues: {
      keyword: '',
      category: 'all',
      stock: 'all',
      status: 'all',
      sort: 'newest'
    }
  })

  return (
    <FormProvider {...methods}>
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'primary.contrastText',
              letterSpacing: '-0.02em'
            }}
          >
            Products
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: 'primary.contrastText', opacity: 0.45, mt: 0.25 }}>
            Manage your store inventory, stock and promotions
          </Typography>
        </Box>

        <ProductActionCards />
        <ProductFilterBar />
        <ProductList />
      </Box>
    </FormProvider>
  )
}

export default ProductsPage