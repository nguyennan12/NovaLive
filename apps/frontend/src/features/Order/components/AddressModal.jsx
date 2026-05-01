import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import {
  Box, Button, Dialog, DialogContent, DialogTitle,
  Divider, TextField, Typography
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { glassSx } from '~/theme'

// TODO: Khi có API địa chỉ, thay TextField tỉnh/huyện/xã bằng Select + dữ liệu từ API
// TODO: Khi có getUserAddressesAPI, hiển thị danh sách địa chỉ đã lưu để user chọn nhanh
// TODO: Tích hợp API vận chuyển (GHN/GHTK) để validate địa chỉ và tính phí ship theo từng địa chỉ

function AddressModal({ open, onClose, onSelect, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || {
      recipientName: '',
      phone: '',
      province: '',
      district: '',
      ward: '',
      addressDetail: ''
    }
  })

  const onSubmit = (data) => {
    onSelect({
      ...data,
      fullAddress: `${data.addressDetail}, ${data.ward}, ${data.district}, ${data.province}`
    })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          ...glassSx,
          bgcolor: 'primary.main',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          m: { xs: 1.5, sm: 3 }
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1.25 }}>
        <LocationOnRoundedIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
        <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>Địa chỉ giao hàng</Typography>
      </DialogTitle>

      <Divider sx={{ borderColor: 'divider' }} />

      <DialogContent sx={{ pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Họ tên + SĐT */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Họ tên người nhận"
            size="small"
            fullWidth
            error={!!errors.recipientName}
            helperText={errors.recipientName?.message}
            {...register('recipientName', { required: 'Vui lòng nhập tên người nhận' })}
          />
          <TextField
            label="Số điện thoại"
            size="small"
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register('phone', {
              required: 'Vui lòng nhập SĐT',
              pattern: { value: /^[0-9]{9,11}$/, message: 'SĐT không hợp lệ' }
            })}
          />
        </Box>

        {/* Tỉnh + Quận */}
        {/* TODO: Thay bằng Select khi tích hợp API tỉnh/thành (vd: VietnamProvinces API) */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Tỉnh / Thành phố"
            size="small"
            fullWidth
            error={!!errors.province}
            helperText={errors.province?.message}
            {...register('province', { required: 'Vui lòng nhập tỉnh/thành' })}
          />
          <TextField
            label="Quận / Huyện"
            size="small"
            fullWidth
            error={!!errors.district}
            helperText={errors.district?.message}
            {...register('district', { required: 'Vui lòng nhập quận/huyện' })}
          />
        </Box>

        {/* Phường / Xã */}
        <TextField
          label="Phường / Xã"
          size="small"
          fullWidth
          error={!!errors.ward}
          helperText={errors.ward?.message}
          {...register('ward', { required: 'Vui lòng nhập phường/xã' })}
        />

        {/* Địa chỉ chi tiết */}
        <TextField
          label="Địa chỉ chi tiết (số nhà, tên đường...)"
          size="small"
          fullWidth
          multiline
          rows={2}
          error={!!errors.addressDetail}
          helperText={errors.addressDetail?.message}
          {...register('addressDetail', { required: 'Vui lòng nhập địa chỉ chi tiết' })}
        />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', pt: 0.5 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: 2, borderColor: 'divider', color: 'primary.contrastText', px: 2.5 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{
              borderRadius: 2, fontWeight: 700, px: 2.5,
              background: 'linear-gradient(90deg, #568dfb, #69aedc)',
              color: '#fff',
              '&:hover': { boxShadow: '0 4px 16px rgba(52,133,247,0.35)' }
            }}
          >
            Xác nhận địa chỉ
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AddressModal
