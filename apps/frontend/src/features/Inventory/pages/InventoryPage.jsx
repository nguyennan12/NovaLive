import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import InventoryIcon from '@mui/icons-material/Inventory'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { Box, Breadcrumbs, Button, Grid, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ProductStockList from '../components/InventoryPage/ProductStockList'
import ReservedStock from '../components/InventoryPage/ReservedStock'
import StockHistory from '../components/InventoryPage/StockHistory'
import StockInForm from '../components/InventoryPage/StockInForm'
import StockOutForm from '../components/InventoryPage/StockOutForm'
import StockOverviewChart from '../components/InventoryPage/StockOverviewChart'

const InventoryPage = () => (
  <Box sx={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #f5f8ff 100%)',
    p: { xs: 2, md: 4 }
  }}>
    {/* Page header */}
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs sx={{ mb: 1.5 }}>
        <Link
          component={RouterLink}
          to="/dashboard/shop/products"
          underline="hover"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.82rem',
            color: 'primary.contrastText'
          }}
        >
          <InventoryIcon sx={{ fontSize: 14 }} /> Inventory
        </Link>

        <Typography
          color="text.primary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.82rem',
            fontWeight: 600
          }}
        >
          <AddIcon sx={{ fontSize: 14 }} /> Manager
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} letterSpacing="-0.5px" sx={{ color: 'primary.contrastText' }}>
            Manager Inventory
          </Typography>
          <Typography variant="body2" color="primary.contrastText" mt={0.25}>
            Control stock movements, track inventory levels, and manage warehouse operations efficiently.
          </Typography>
        </Box>
      </Box>
    </Box>

    <Grid container spacing={2}>
      {/* Row 1: Chart – full width */}
      <Grid size={12}>
        <StockOverviewChart />
      </Grid>

      {/* Row 2: Stock In / Stock Out – 2 cols */}
      <Grid size={{ xs: 12, md: 6 }}>
        <StockInForm />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <StockOutForm />
      </Grid>

      {/* Row 3: Product list + Reserved */}
      <Grid size={{ xs: 12, lg: 7 }}>
        <ProductStockList />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <ReservedStock />
      </Grid>

      {/* Row 4: History – full width */}
      <Grid size={12}>
        <StockHistory />
      </Grid>
    </Grid>
  </Box>
)

export default InventoryPage