import LockIcon from '@mui/icons-material/Lock'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton, InputAdornment,
  TextField, Typography
} from '@mui/material'
import { useState } from 'react'

const FIELDS = [
  { key: 'oldPassword', label: 'Mật khẩu hiện tại', showKey: 'old' },
  { key: 'newPassword', label: 'Mật khẩu mới', showKey: 'new' },
  { key: 'confirmPassword', label: 'Xác nhận mật khẩu mới', showKey: 'confirm' }
]

const EMPTY_FORM = { oldPassword: '', newPassword: '', confirmPassword: '' }

// Dialog for changing user password with validation
const ChangePasswordDialog = ({ open, onClose, onSubmit, isSaving }) => {
  const [form, setForm] = useState(EMPTY_FORM)
  const [show, setShow] = useState({ old: false, new: false, confirm: false })
  const [error, setError] = useState('')

  const handleChange = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
    setError('')
  }

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setError('')
    onClose()
  }

  const validate = () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword)
      return 'Vui lòng điền đầy đủ thông tin'
    if (form.newPassword.length < 8)
      return 'Mật khẩu mới phải ít nhất 8 ký tự'
    if (form.newPassword !== form.confirmPassword)
      return 'Mật khẩu xác nhận không khớp'
    return null
  }

  const handleSubmit = () => {
    const err = validate()
    if (err) { setError(err); return }
    onSubmit(
      { oldPassword: form.oldPassword, newPassword: form.newPassword },
      { onSuccess: handleClose }
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
        <LockIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
        Đổi mật khẩu
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {FIELDS.map(({ key, label, showKey }) => (
            <TextField
              key={key}
              fullWidth
              label={label}
              type={show[showKey] ? 'text' : 'password'}
              value={form[key]}
              onChange={handleChange(key)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                      edge="end"
                    >
                      {show[showKey] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          ))}
          {error && (
            <Typography color="error" variant="body2" sx={{ fontSize: '0.8rem' }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} size="small" color="inherit">Hủy</Button>
        <Button
          onClick={handleSubmit}
          size="small"
          variant="contained"
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : null}
          sx={{ background: 'linear-gradient(90deg,#0095ff,#14c3eb)', color: '#fff' }}
        >
          Đổi mật khẩu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePasswordDialog
