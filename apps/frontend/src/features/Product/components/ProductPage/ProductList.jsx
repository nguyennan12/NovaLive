import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import ProductCard from './ProductCard'
import UpdateProductDrawer from './UpdateProductDrawer'

const MOCK_PRODUCTS = [
  { id: 1, name: 'Air Force 1 Low', price: '59', stock: 'in', category: 'Footwear', brand: 'Nike' },
  { id: 2, name: 'Wireless Earbuds Pro', price: '89', stock: 'low', category: 'Electronics', brand: 'Sony' },
  { id: 3, name: 'Leather Crossbody Bag', price: '120', stock: 'in', category: 'Accessories', brand: 'Coach' },
  { id: 4, name: 'Running Shoes X3', price: '75', stock: 'out', category: 'Footwear', brand: 'Adidas' },
  { id: 5, name: 'Stainless Water Bottle', price: '22', stock: 'in', category: 'Lifestyle', brand: 'Hydro Flask' },
  { id: 6, name: 'Slim Fit Jeans', price: '55', stock: 'low', category: 'Clothing', brand: 'Levi\'s' },
  { id: 7, name: 'Bamboo Desk Organizer', price: '38', stock: 'in', category: 'Office', brand: 'Muji' },
  { id: 8, name: 'Ceramic Coffee Mug', price: '18', stock: 'in', category: 'Kitchen', brand: 'Fellow' }
]

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setDrawerOpen(true)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'primary.contrastText' }}>
          Product List
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'primary.contrastText', opacity: 0.45 }}>
          Showing {MOCK_PRODUCTS.length} of 1,245
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
        {MOCK_PRODUCTS.map((product, i) => (
          <Box key={product.id} >
            <ProductCard product={product} index={i} onEdit={handleEdit} />
          </Box>
        ))}
      </Box>

      <UpdateProductDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        product={selectedProduct}
      />
    </>
  )
}

export default ProductList