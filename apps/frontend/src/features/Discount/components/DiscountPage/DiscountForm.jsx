import { useEffect } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import {
  Box, TextField, FormControl, InputLabel, Select, MenuItem,
  ToggleButton, ToggleButtonGroup, Typography, Divider, Paper
} from '@mui/material'
import PercentRoundedIcon from '@mui/icons-material/PercentRounded'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'

/* ─── shared tokens ─── */
const inputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'divider' },
    '&:hover fieldset': { borderColor: 'secondary.main' },
    '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
  },
  '& label.Mui-focused': { color: 'secondary.main' }
}
const dateSx = {
  ...inputSx,
  '& input[type="date"]::-webkit-calendar-picker-indicator': { opacity: 0.4, cursor: 'pointer' },
  '& label': {
    background: '#fff', padding: '0 4px', marginLeft: '-2px',
    color: 'text.secondary', '&.Mui-focused': { color: 'secondary.main' }
  }
}
const sectionLabel = {
  fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.09em',
  textTransform: 'uppercase', color: 'text.secondary', mb: 0.5
}
const cardSx = {
  boxShadow: 'none',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '12px',
  p: 2,
  bgcolor: '#fff'
}

const toDateInputValue = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

const toDefaultValues = (discount = {}) => ({
  discount_name: discount.discount_name ?? discount.name ?? '',
  discount_description: discount.discount_description ?? discount.description ?? '',
  discount_code: discount.discount_code ?? discount.code ?? '',
  discount_start_date: toDateInputValue(discount.discount_start_date ?? discount.startDate),
  discount_end_date: toDateInputValue(discount.discount_end_date ?? discount.endDate),
  discount_is_active: typeof discount.discount_is_active === 'boolean'
    ? discount.discount_is_active
    : (discount.status ? discount.status === 'active' : true),
  discount_target: discount.discount_target ?? (discount.category === 'freeship' ? 'shipping' : 'product'),
  discount_type: discount.discount_type
    ?? (discount.type === 'fixed' || discount.type === 'amount' ? 'fixed_amount' : 'percentage'),
  discount_applies_to: discount.discount_applies_to ?? 'all',
  discount_scope: discount.discount_scope ?? 'global',
  discount_shopId: discount.discount_shopId ?? null,
  discount_min_value: discount.discount_min_value ?? discount.minOrder ?? '',
  discount_value: discount.discount_value ?? discount.value ?? '',
  discount_max_value: discount.discount_max_value ?? discount.value ?? '',
  discount_max_uses: discount.discount_max_uses ?? discount.usageLimit ?? '',
  discount_uses_count: discount.discount_uses_count ?? discount.usedCount ?? 0,
  discount_users_used: discount.discount_users_used ?? [],
  discount_max_uses_per_user: discount.discount_max_uses_per_user ?? 1,
  discount_product_ids: discount.discount_product_ids ?? []
})

const toApiPayload = (data) => ({
  discount_name: data.discount_name.trim(),
  discount_description: data.discount_description.trim(),
  discount_code: data.discount_code?.trim().toUpperCase() || null,
  discount_start_date: data.discount_start_date ? new Date(`${data.discount_start_date}T00:00:00.000Z`).toISOString() : null,
  discount_end_date: data.discount_end_date ? new Date(`${data.discount_end_date}T23:59:59.999Z`).toISOString() : null,
  discount_is_active: Boolean(data.discount_is_active),
  discount_target: data.discount_target,
  discount_type: data.discount_type,
  discount_applies_to: data.discount_applies_to ?? 'all',
  discount_scope: data.discount_scope ?? 'global',
  discount_shopId: data.discount_shopId || null,
  discount_min_value: Number(data.discount_min_value),
  discount_value: Number(data.discount_value),
  discount_max_value: Number(data.discount_max_value),
  discount_max_uses: Number(data.discount_max_uses),
  discount_uses_count: Number(data.discount_uses_count ?? 0),
  discount_users_used: Array.isArray(data.discount_users_used) ? data.discount_users_used : [],
  discount_max_uses_per_user: Number(data.discount_max_uses_per_user ?? 1),
  discount_product_ids: Array.isArray(data.discount_product_ids) ? data.discount_product_ids : []
})

const toggleSx = (activeColor = 'secondary.main', activeBg = '#e6efff') => ({
  width: '100%',
  '& .MuiToggleButton-root': {
    flex: 1, py: 0.5, fontSize: '0.75rem', fontWeight: 600,
    gap: 0.5, textTransform: 'none', color: 'text.secondary',
    border: '1px solid', borderColor: 'divider',
    '&.Mui-selected': { bgcolor: activeBg, color: activeColor, borderColor: activeColor },
    '&.Mui-selected:hover': { filter: 'brightness(0.95)' }
  }
})

const DEFAULT_VALUES = {
  discount_name: '',
  discount_description: '',
  discount_code: '',
  discount_start_date: '',
  discount_end_date: '',
  discount_is_active: true,
  discount_target: 'product',
  discount_type: 'percentage',
  discount_applies_to: 'all',
  discount_scope: 'global',
  discount_shopId: null,
  discount_min_value: '',
  discount_value: '',
  discount_max_value: '',
  discount_max_uses: '',
  discount_uses_count: 0,
  discount_users_used: [],
  discount_max_uses_per_user: 1,
  discount_product_ids: []
}

export const DiscountForm = ({ onSubmit, editData }) => {
  const { control, handleSubmit, reset, formState: { errors } } =
    useForm({ defaultValues: DEFAULT_VALUES })

  const watchType = useWatch({ control, name: 'discount_type' })
  const watchStart = useWatch({ control, name: 'discount_start_date' })

  useEffect(() => {
    reset(editData ? { ...DEFAULT_VALUES, ...toDefaultValues(editData) } : DEFAULT_VALUES)
  }, [editData, reset])

  const onFormSubmit = (data) => {
    onSubmit(toApiPayload(data))
    reset(DEFAULT_VALUES)
  }

  return (
    <Box
      component="form"
      id="discount-form"
      onSubmit={handleSubmit(onFormSubmit)}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2,
        width: '100%'
      }}
    >
      {/* ── GENERAL INFORMATION ── */}
      <Paper sx={cardSx}>
        <Typography sx={sectionLabel}>General information</Typography>
        <Divider sx={{ borderStyle: 'dashed', mb: 1.5 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Controller
            name="discount_name" control={control}
            rules={{ required: 'Required', minLength: { value: 3, message: 'Minimum 3 characters' } }}
            render={({ field }) => (
              <TextField {...field} label="Program name *" size="small" fullWidth
                error={!!errors.discount_name} helperText={errors.discount_name?.message}
                placeholder="Summer Flash Sale" sx={inputSx} />
            )}
          />
          <Controller
            name="discount_code" control={control}
            render={({ field }) => (
              <TextField {...field} label="Code" size="small" fullWidth
                placeholder="SUMMER24"
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                inputProps={{ style: { fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.08em' } }}
                helperText="Optional" sx={inputSx} />
            )}
          />
        </Box>
      </Paper>

      {/* ── DISCOUNT VALUE ── */}
      <Paper sx={cardSx}>
        <Typography sx={sectionLabel}>Discount value</Typography>
        <Divider sx={{ borderStyle: 'dashed', mb: 1.5 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Category + discount type */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box>
              <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', fontWeight: 700, mb: 0.5 }}>Category</Typography>
              <Controller name="discount_target" control={control}
                render={({ field }) => (
                  <ToggleButtonGroup exclusive size="small" value={field.value}
                    onChange={(_, v) => v && field.onChange(v)} sx={toggleSx('#7c3aed', '#f5f3ff')}>
                    <ToggleButton value="product"><LocalOfferRoundedIcon sx={{ fontSize: 13 }} /> Product</ToggleButton>
                    <ToggleButton value="shipping"><LocalShippingRoundedIcon sx={{ fontSize: 13 }} /> Free shipping</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', fontWeight: 700, mb: 0.5 }}>Discount type</Typography>
              <Controller name="discount_type" control={control}
                render={({ field }) => (
                  <ToggleButtonGroup exclusive size="small" value={field.value}
                    onChange={(_, v) => v && field.onChange(v)} sx={toggleSx()}>
                    <ToggleButton value="percentage"><PercentRoundedIcon sx={{ fontSize: 13 }} /> %</ToggleButton>
                    <ToggleButton value="fixed_amount"><AttachMoneyRoundedIcon sx={{ fontSize: 13 }} /> Fixed</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Box>
          </Box>

          {/* Value + usage limit + minimum order */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
            <Controller name="discount_value" control={control}
              rules={{
                required: 'Required', min: { value: 1, message: '> 0' },
                ...(watchType === 'percentage' && { max: { value: 100, message: '≤ 100' } })
              }}
              render={({ field }) => (
                <TextField {...field} size="small" type="number" fullWidth
                  label={watchType === 'percentage' ? 'Discount rate (%) *' : 'Discount amount (₫) *'}
                  error={!!errors.discount_value} helperText={errors.discount_value?.message}
                  placeholder={watchType === 'percentage' ? '20' : '50000'} sx={inputSx} />
              )}
            />
            <Controller name="discount_max_value" control={control}
              rules={{ required: 'Required', min: { value: 1, message: '≥ 1' } }}
              render={({ field }) => (
                <TextField {...field} size="small" type="number" fullWidth
                  label="Maximum discount amount (₫) *"
                  placeholder={watchType === 'percentage' ? '100000' : '50000'}
                  error={!!errors.discount_max_value} helperText={errors.discount_max_value?.message} sx={inputSx} />
              )}
            />
            <Controller name="discount_min_value" control={control}
              rules={{ required: 'Required', min: { value: 0, message: '≥ 0' } }}
              render={({ field }) => (
                <TextField {...field} size="small" type="number" fullWidth
                  label="Minimum order (₫) *" placeholder="0"
                  error={!!errors.discount_min_value} helperText={errors.discount_min_value?.message} sx={inputSx} />
              )}
            />
            <Controller name="discount_max_uses" control={control}
              rules={{ required: 'Required', min: { value: 1, message: '≥ 1' } }}
              render={({ field }) => (
                <TextField {...field} size="small" type="number" fullWidth
                  label="Usage limit *" placeholder="500"
                  error={!!errors.discount_max_uses} helperText={errors.discount_max_uses?.message} sx={inputSx} />
              )}
            />
          </Box>
        </Box>
      </Paper>

      {/* ── APPLY CONDITIONS ── */}
      <Paper sx={cardSx}>
        <Typography sx={sectionLabel}>Apply conditions</Typography>
        <Divider sx={{ borderStyle: 'dashed', mb: 1.5 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Controller name="discount_start_date" control={control} rules={{ required: 'Required' }}
              render={({ field }) => (
                <Box>
                  <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', fontWeight: 700, mb: 0.5 }}>Start date *</Typography>
                  <TextField {...field} size="small" type="date" fullWidth
                    error={!!errors.discount_start_date} helperText={errors.discount_start_date?.message}
                    sx={dateSx} />
                </Box>
              )}
            />
            <Controller name="discount_end_date" control={control}
              rules={{ required: 'Required', validate: v => !watchStart || v >= watchStart || 'Must be after the start date' }}
              render={({ field }) => (
                <Box>
                  <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', fontWeight: 700, mb: 0.5 }}>End date *</Typography>
                  <TextField {...field} size="small" type="date" fullWidth
                    error={!!errors.discount_end_date} helperText={errors.discount_end_date?.message}
                    sx={dateSx} />
                </Box>
              )}
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Controller name="discount_is_active" control={control}
              render={({ field }) => (
                <FormControl size="small" fullWidth sx={inputSx}>
                  <InputLabel>Active status *</InputLabel>
                  <Select
                    {...field}
                    value={field.value ? 'true' : 'false'}
                    onChange={(e) => field.onChange(e.target.value === 'true')}
                    label="Active status *"
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            <Controller name="discount_scope" control={control}
              render={({ field }) => (
                <FormControl size="small" fullWidth sx={inputSx}>
                  <InputLabel>Scope</InputLabel>
                  <Select {...field} label="Scope">
                    <MenuItem value="global">Global</MenuItem>
                    <MenuItem value="shop">Shop</MenuItem>
                    <MenuItem value="live">Live</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </Box>
      </Paper>

      {/* ── NOTES ── */}
      <Paper sx={cardSx}>
        <Typography sx={sectionLabel}>Notes</Typography>
        <Divider sx={{ borderStyle: 'dashed', mb: 1.5 }} />
        <Controller name="discount_description" control={control}
          render={({ field }) => (
            <TextField {...field} size="small" fullWidth multiline minRows={4}
              placeholder="Additional terms, internal notes..." sx={inputSx} />
          )}
        />
      </Paper>
    </Box>
  )
}