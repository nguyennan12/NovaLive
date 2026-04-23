import { useState } from 'react'
import {
  Box, TextField, Button, MenuItem, Select, InputLabel,
  FormControl, FormHelperText, Typography, Autocomplete, Alert, Collapse
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import { PRODUCTS, WAREHOUSES } from '../../../../../mockdata/stockdata'
import SectionCard from '../shared/SectionCard'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontSize: '0.85rem',
    borderRadius: '8px',
    bgcolor: '#fafafa',
    '& fieldset': { borderColor: '#eeeeee' },
    '&:hover fieldset': { borderColor: 'secondary.main' },
    '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: '1.5px' }
  },
  '& label': { fontSize: '0.8rem' },
  '& label.Mui-focused': { color: 'secondary.main' }
}

const INIT = { product: null, qty: '', warehouse: '', note: '' }

const StockInForm = () => {
  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.product) e.product = 'Please select a product'
    if (!form.qty || isNaN(form.qty) || Number(form.qty) <= 0) e.qty = 'Enter a valid quantity > 0'
    if (!form.warehouse) e.warehouse = 'Select a warehouse'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setSuccess(true)
    setForm(INIT)
    setTimeout(() => setSuccess(false), 3000)
  }

  const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }))

  return (
    <SectionCard
      title='Stock In'
      subtitle='Record incoming inventory'
      icon={<Inventory2OutlinedIcon />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Collapse in={success}>
          <Alert
            icon={<CheckCircleOutlineRoundedIcon fontSize='small' />}
            severity='success'
            sx={{ borderRadius: '8px', fontSize: '0.8rem', mb: 0.5 }}
          >
            Stock added successfully!
          </Alert>
        </Collapse>

        {/* Product select */}
        <Autocomplete
          options={PRODUCTS}
          getOptionLabel={(o) => `${o.name} — ${o.sku}`}
          value={form.product}
          onChange={(_, v) => set('product')(v)}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Product *'
              size='small'
              error={!!errors.product}
              helperText={errors.product}
              sx={fieldSx}
            />
          )}
          renderOption={(props, option) => (
            <Box component='li' {...props} sx={{ py: 1 }}>
              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#2d2d2d' }}>
                  {option.name}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                  {option.sku} · {option.brand}
                </Typography>
              </Box>
            </Box>
          )}
        />

        {/* Quantity */}
        <TextField
          label='Quantity *'
          size='small'
          type='number'
          inputProps={{ min: 1 }}
          value={form.qty}
          onChange={(e) => set('qty')(e.target.value)}
          error={!!errors.qty}
          helperText={errors.qty}
          sx={fieldSx}
        />

        {/* Warehouse */}
        <FormControl size='small' error={!!errors.warehouse}>
          <InputLabel sx={{ fontSize: '0.8rem', '&.Mui-focused': { color: 'secondary.main' } }}>
            Warehouse Location *
          </InputLabel>
          <Select
            label='Warehouse Location *'
            value={form.warehouse}
            onChange={(e) => set('warehouse')(e.target.value)}
            sx={{
              fontSize: '0.85rem',
              borderRadius: '8px',
              bgcolor: '#fafafa',
              '& fieldset': { borderColor: '#eeeeee' },
              '&:hover fieldset': { borderColor: 'secondary.main' },
              '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: '1.5px' }
            }}
          >
            {WAREHOUSES.map((w) => (
              <MenuItem key={w} value={w} sx={{ fontSize: '0.82rem' }}>{w}</MenuItem>
            ))}
          </Select>
          {errors.warehouse && <FormHelperText>{errors.warehouse}</FormHelperText>}
        </FormControl>

        {/* Note */}
        <TextField
          label='Note'
          size='small'
          multiline
          rows={2}
          placeholder='e.g. Received from supplier, batch #...'
          value={form.note}
          onChange={(e) => set('note')(e.target.value)}
          sx={fieldSx}
        />

        <Button
          variant='contained'
          startIcon={<AddRoundedIcon />}
          onClick={handleSubmit}
          sx={{
            bgcolor: 'secondary.main',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            borderRadius: '8px',
            py: 1,
            boxShadow: '0 2px 8px rgba(52,133,247,0.35)',
            '&:hover': { bgcolor: '#2471e0', boxShadow: '0 4px 12px rgba(52,133,247,0.4)' }
          }}
        >
          Add Stock
        </Button>
      </Box>
    </SectionCard>
  )
}

export default StockInForm