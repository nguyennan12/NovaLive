import { useState } from 'react'
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText, Typography, Autocomplete, Alert, Collapse, Chip } from '@mui/material'
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import { PRODUCTS, OUT_REASONS } from '../../../../../mockdata/stockdata'
import SectionCard from '../shared/SectionCard'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontSize: '0.85rem',
    borderRadius: '8px',
    bgcolor: '#fafafa',
    '& fieldset': { borderColor: '#eeeeee' },
    '&:hover fieldset': { borderColor: 'third.main' },
    '&.Mui-focused fieldset': { borderColor: 'third.main', borderWidth: '1.5px' }
  },
  '& label': { fontSize: '0.8rem' },
  '& label.Mui-focused': { color: 'third.main' }
}

const REASON_META = {
  order: { label: 'Order Fulfillment', color: '#3485f7' },
  damaged: { label: 'Damaged / Write-off', color: '#ef4444' },
  transfer: { label: 'Warehouse Transfer', color: '#f59e0b' },
  adjustment: { label: 'Stock Adjustment', color: '#9ca3af' }
}

const INIT = { product: null, qty: '', reason: '', note: '' }

const StockOutForm = () => {
  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.product) e.product = 'Please select a product'
    if (!form.qty || isNaN(form.qty) || Number(form.qty) <= 0) e.qty = 'Enter a valid quantity > 0'
    if (form.product && Number(form.qty) > form.product.stock)
      e.qty = `Exceeds available stock (${form.product.stock} units)`
    if (!form.reason) e.reason = 'Select an outbound reason'
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
      title='Stock Out'
      subtitle='Record outgoing inventory'
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Collapse in={success}>
          <Alert
            icon={<CheckCircleOutlineRoundedIcon fontSize='small' />}
            severity='success'
            sx={{ borderRadius: '8px', fontSize: '0.8rem', mb: 0.5 }}
          >
            Stock removed successfully!
          </Alert>
        </Collapse>

        {/* Product select */}
        <Autocomplete
          options={PRODUCTS}
          getOptionLabel={(o) => `${o.name} — ${o.sku}`}
          value={form.product}
          onChange={(_, v) => { set('product')(v); set('qty')('') }}
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
            <Box component='li' {...props}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#2d2d2d' }}>
                  {option.name}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                  {option.sku} · Available: {option.stock}
                </Typography>
              </Box>
              {option.stock <= 0 && (
                <Chip label='Out' size='small' sx={{ fontSize: '0.6rem', bgcolor: '#fef2f2', color: '#ef4444', height: 18 }} />
              )}
            </Box>
          )}
        />

        {/* Stock indicator */}
        {form.product && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 1,
              bgcolor: form.product.stock <= 10 ? '#fffbeb' : '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: form.product.stock <= 10 ? '#fde68a' : '#bbf7d0'
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: form.product.stock <= 10 ? '#f59e0b' : '#22c55e'
              }}
            />
            <Typography sx={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: 500 }}>
              Current stock: <strong>{form.product.stock} units</strong>
            </Typography>
          </Box>
        )}

        {/* Quantity */}
        <TextField
          label='Quantity *'
          size='small'
          type='number'
          inputProps={{ min: 1, max: form.product?.stock || undefined }}
          value={form.qty}
          onChange={(e) => set('qty')(e.target.value)}
          error={!!errors.qty}
          helperText={errors.qty}
          sx={fieldSx}
        />

        {/* Reason */}
        <FormControl size='small' error={!!errors.reason}>
          <InputLabel sx={{ fontSize: '0.8rem', '&.Mui-focused': { color: 'third.main' } }}>
            Reason *
          </InputLabel>
          <Select
            label='Reason *'
            value={form.reason}
            onChange={(e) => set('reason')(e.target.value)}
            sx={{
              fontSize: '0.85rem',
              borderRadius: '8px',
              bgcolor: '#fafafa',
              '& fieldset': { borderColor: '#eeeeee' },
              '&:hover fieldset': { borderColor: 'third.main' },
              '&.Mui-focused fieldset': { borderColor: 'third.main', borderWidth: '1.5px' }
            }}
          >
            {OUT_REASONS.map((r) => (
              <MenuItem key={r} value={r} sx={{ fontSize: '0.82rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: REASON_META[r].color }} />
                  {REASON_META[r].label}
                </Box>
              </MenuItem>
            ))}
          </Select>
          {errors.reason && <FormHelperText>{errors.reason}</FormHelperText>}
        </FormControl>

        {/* Note */}
        <TextField
          label='Note'
          size='small'
          multiline
          rows={2}
          placeholder='e.g. Order #8821, transfer to warehouse B...'
          value={form.note}
          onChange={(e) => set('note')(e.target.value)}
          sx={fieldSx}
        />

        <Button
          variant='contained'
          startIcon={<RemoveCircleOutlineRoundedIcon />}
          onClick={handleSubmit}
          sx={{
            bgcolor: 'third.main',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            borderRadius: '8px',
            py: 1,
            boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
            '&:hover': { bgcolor: 'third.main', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }
          }}
        >
          Export Stock
        </Button>
      </Box>
    </SectionCard>
  )
}

export default StockOutForm