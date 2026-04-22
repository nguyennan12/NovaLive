import { Autocomplete, Box, Chip, CircularProgress, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFormContext } from 'react-hook-form'

const CATEGORIES = ['Footwear', 'Sneakers', 'Running', 'Lifestyle', 'Basketball', 'Training']

const fetchAttributesAPI = async (selectedCategories) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let attributes = []
      if (selectedCategories.includes('Sneakers')) {
        attributes.push(
          { name: 'material', label: 'Material', type: 'text', placeholder: 'e.g. Leather, Suede' },
          { name: 'closure_type', label: 'Closure Type', type: 'select', options: ['Lace-up', 'Slip-on', 'Velcro'] }
        )
      }
      if (selectedCategories.includes('Running')) {
        attributes.push(
          { name: 'cushioning', label: 'Cushioning Level', type: 'select', options: ['High', 'Medium', 'Minimal'] },
          { name: 'drop_mm', label: 'Heel-to-toe Drop (mm)', type: 'number', placeholder: 'e.g. 8' }
        )
      }
      const uniqueAttributes = Array.from(new Map(attributes.map(item => [item.name, item])).values())
      resolve(uniqueAttributes)
    }, 50)
  })
}

export default function ProductDetailsCard() {
  const { control, watch } = useFormContext()
  const selectedCategories = watch('spu_category') || []

  //call api that o day
  const fetchAttributes = async (categories) => {
    return await fetchAttributesAPI(categories)
  }

  //mỗi khi category thay đổi thì gọi api lấy attribtue
  const { data: dynamicAttrs, isLoading: loadingAttrs } = useQuery({
    queryKey: ['attributes', selectedCategories],
    queryFn: () => fetchAttributes(selectedCategories),
    enabled: selectedCategories.length > 0
  })

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, border: '1px solid secondary.contrastText', mt: 2 }}>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>Categories & Attributes</Typography>
      {/* Categories */}
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="caption" color="primary.contrastText" display="block" mb={2}>Categories</Typography>
        <Controller
          name="spu_category"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Autocomplete
              {...field}
              multiple size="small" options={CATEGORIES} value={value || []}
              onChange={(_, newValue) => onChange(newValue)}
              renderTags={(val, getTagProps) =>
                val.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })} key={index} label={option} size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #eef2ff, #dbeafe)',
                      color: 'primary.main', fontWeight: 600, fontSize: '0.72rem'
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} placeholder="Add categories..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, background: 'primary.contrastText' } }} />
              )}
            />
          )}
        />
      </Box>

      {/* Attributes */}
      {loadingAttrs && (
        <Box display="flex" alignItems="center" gap={1} mb={2} px={1}>
          <CircularProgress size={16} />
          <Typography variant="caption" color="text.secondary">Loading attributes...</Typography>
        </Box>
      )}

      {(dynamicAttrs && dynamicAttrs.length > 0) && !loadingAttrs && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="caption" fontWeight={700} color="primary.main" display="block" >
            Attributes
          </Typography>
          <Box sx={{ p: 2, mb: 2, background: 'primary.contrastText', borderRadius: 2.5, border: '2px solid secondary.contrastText' }}>
            {dynamicAttrs.map((attr) => (
              <Box mt={1.5} key={attr.name}>
                <Typography variant="caption" color="text.secondary" display="block" mb={0.75}>
                  {attr.label}
                </Typography>

                <Controller
                  name={`attributes.${attr.name}`}
                  control={control}
                  render={({ field }) => {
                    //nếu attribute là select thì cho chọn
                    if (attr.type === 'select') {
                      return (
                        <Select
                          {...field}
                          fullWidth size="small" displayEmpty
                          value={field.value || ''}
                          sx={{
                            borderRadius: 2, background: 'primary.contrastText',
                            '& .MuiInputBase-input': { color: 'gray' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'secondary.main' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'secondary.main' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'secondary.main' }
                          }}
                        >
                          <MenuItem value="" disabled>Select {attr.label}</MenuItem>
                          {attr.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                        </Select>
                      )
                    }
                    //default là text
                    return (
                      <TextField
                        {...field}
                        value={field.value || ''}
                        fullWidth size="small" type={attr.type}
                        placeholder={attr.placeholder}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'primary.contrastText' }
                        }}
                      />
                    )
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

      )}
    </Paper>
  )
}