import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import InventoryIcon from '@mui/icons-material/Inventory'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { Box, Breadcrumbs, Button, Link, Paper, Tab, Tabs, Typography, useColorScheme } from '@mui/material'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import AdvanceTab from './Components/AdvanceTab'
import GeneralTab from './Components/GeneralTab'
import ProductDetailsCard from './Components/ProductDetailsCard'
import StatusCard from './Components/StatusCard'
import ThumbnailUpload from './Components/ThumbnailUpload'
import { toast } from 'react-toastify'
import AppBar from '~/components/layout/AppBar/AppBar'

const initialForm = {
  name: 'New Balance 2002R Light Grey',
  description: 'If you unsure regarding your size, please click the size chart button and browse through the chart to find your correct measurements. For more details, kindly add our Customer Service to consult further.',
  basePrice: '132',
  comparePrice: '',
  discountType: 'none',
  discountValue: '',
  category: 'Sneakers',
  tags: ['New Balance', 'Trending'],
  brand: 'New Balance',
  sku: 'NB-2002R-LGY',
  stock: '85',
  weight: '',
  width: '',
  height: '',
  depth: '',
  status: 'published',
  metaTitle: '',
  metaDesc: '',
  slug: 'new-balance-2002r-light-grey',
  sizes: ['US 8', 'US 9', 'US 10'],
  colors: 'Light Grey, Silver',
  taxable: true,
  freeShipping: false,
  returnAllowed: true,
  featured: false
}
const AddProductPage = () => {
  const { mode } = useColorScheme()
  const [tab, setTab] = useState(0)

  const methods = useForm({ defaultValues: initialForm, mode: 'onBlur' })

  const { handleSubmit, reset } = methods

  const onSubmit = (data) => {
    toast.success('Add product successfully!')
    console.log('Payload Data:', data)
  }


  const onError = (errors) => {
    toast.error('Please check the required fields!')
  }

  const handleCancel = () => {
    reset(initialForm)
    toast.info('Changes discarded.')
  }

  return (
    <FormProvider {...methods}>
      <AppBar />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, onError)}
        sx={{
          minHeight: '100vh',
          background: mode === 'light' ?
            'linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #f5f8ff 100%)' :
            'linear-gradient(135deg, #222222 , #101010 , #111111 )',
          p: { xs: 2, md: 4 }
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs sx={{ mb: 1.5 }}>
            <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.82rem', color: 'primary.contrastText' }}>
              <HomeIcon sx={{ fontSize: 14 }} /> Dashboard
            </Link>
            <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.82rem', color: 'primary.contrastText' }}>
              <InventoryIcon sx={{ fontSize: 14 }} /> Products
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.82rem', fontWeight: 600 }}>
              <AddIcon sx={{ fontSize: 14 }} /> Add New
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={800} letterSpacing="-0.5px" sx={{ color: 'primary.contrastText' }}>
                Add New Product
              </Typography>
              <Typography variant="body2" color="primary.contrastText" mt={0.25}>
                Fill in all details below to publish a new product listing.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={handleCancel}
                sx={{ borderRadius: 2.5, px: 2.5, py: 1, borderColor: 'secondary.main', color: mode === 'light' ? '#555' : '#ccc', '&:hover': { borderColor: mode === 'light' ? '#ccc' : '#666', background: mode === 'light' ? '#fafafa' : '#333' } }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                sx={{
                  borderRadius: 2.5, px: 3, py: 1, fontWeight: '500',
                  background: 'linear-gradient(90deg, #4c83f0, #69aedc, #8acdde)',
                  color: '#ffffff'
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>
          {/* LEFT main content */}
          <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, border: '1px solid secondary.contrastText', mb: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1.5}>Thumbnail</Typography>
              <ThumbnailUpload />
            </Paper>

            <StatusCard />
            <ProductDetailsCard />

          </Box>

          {/* RIGHT main content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper variant="outlined" sx={{ borderRadius: 3, border: '1px solid secondary.contrastText', overflow: 'hidden' }}>
              <Box sx={{ borderBottom: '1px solid secondary.contrastText', px: 3, background: 'secondary.contrastText' }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ '& .MuiTabs-indicator': { background: mode === 'light' ? 'linear-gradient(90deg, #3465c8, #5b85e8)' : 'linear-gradient(90deg, #3492df, #74c9fa)', borderRadius: 2, height: 3 }, '& .Mui-selected': { color: 'secondary.main' } }}>
                  <Tab label="General" />
                  <Tab label="Advance" />
                </Tabs>
              </Box>

              <Box sx={{ p: 3, background: 'transparent' }}>
                {tab === 0 && <GeneralTab />}
                {tab === 1 && <AdvanceTab />}
              </Box>
            </Paper>
          </Box>
        </Box>

      </Box>
    </FormProvider>
  )
}

export default AddProductPage