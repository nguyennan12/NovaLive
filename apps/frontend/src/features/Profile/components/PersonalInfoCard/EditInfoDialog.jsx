import { useEffect, useState } from 'react'
import {
  Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, MenuItem, TextField
} from '@mui/material'

const GENDER_OPTIONS = [
  { label: 'Nam', value: 'male' },
  { label: 'Nữ', value: 'female' },
  { label: 'Khác', value: 'other' }
]

// Generic dialog for editing a single profile field (text / select / date)
const EditInfoDialog = ({ open, onClose, field, label, currentValue, onSave, isSaving }) => {
  const [value, setValue] = useState(currentValue || '')

  useEffect(() => {
    if (open) setValue(currentValue || '')
  }, [open, currentValue])

  const handleSubmit = () => onSave({ [field]: value })

  const inputType = field === 'user_phone' ? 'tel' : 'text'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem' }}>
        Chỉnh sửa {label}
      </DialogTitle>

      <DialogContent>
        {field === 'user_gender' ? (
          <TextField
            select fullWidth label={label}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ mt: 1 }}
          >
            {GENDER_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        ) : field === 'user_birthday' ? (
          <TextField
            fullWidth type="date" label={label}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1 }}
          />
        ) : (
          <TextField
            fullWidth label={label} type={inputType}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ mt: 1 }}
            onKeyDown={(e) => { if (e.key === 'Enter' && value) handleSubmit() }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} size="small" color="inherit">Hủy</Button>
        <Button
          onClick={handleSubmit}
          size="small"
          variant="contained"
          disabled={isSaving || !value}
          startIcon={isSaving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : null}
          sx={{ background: 'linear-gradient(90deg,#0095ff,#14c3eb)', color: '#fff' }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditInfoDialog
