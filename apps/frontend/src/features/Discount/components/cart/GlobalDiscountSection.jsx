/* eslint-disable no-lonely-if */
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import { Box, Button, CircularProgress, Collapse, Divider, InputAdornment, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { validateVoucherAPI } from '~/common/apis/services/cartService'
import { formatVND } from '~/common/utils/formatters'
import { glassSx, gradientText } from '~/theme'
import { normalizeDiscount } from '../../utils/normalizeDiscount'
import { useDiscounts } from '../../hook/useDiscounts'
import { DiscountCardMini } from './DiscountCardMini'

function AppliedBadge({ voucher, onClear, color = 'secondary.main', bgColor = 'rgba(52,133,247,0.06)', borderColor = 'rgba(52,133,247,0.18)' }) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1,
      px: 1.5, py: 0.9, borderRadius: 2,
      bgcolor: bgColor, border: '1px solid', borderColor
    }}>
      <CheckCircleRoundedIcon sx={{ fontSize: 13, color, flexShrink: 0 }} />
      <Typography sx={{ flex: 1, fontSize: '0.77rem', color, fontWeight: 600, lineHeight: 1.3 }}>
        {voucher.code ?? voucher.name}
        {voucher.type === 'percentage'
          ? ` — Giảm ${voucher.value}%${voucher.maxValue ? ` (tối đa ${formatVND(voucher.maxValue)})` : ''}`
          : voucher.category === 'freeship' ? ' — Miễn phí vận chuyển'
            : ` — Giảm ${formatVND(voucher.value)}`
        }
      </Typography>
      <Button
        size="small" color="error"
        onClick={onClear}
        sx={{ textTransform: 'none', fontSize: '0.7rem', py: 0.2, minWidth: 'unset', flexShrink: 0 }}
      >
        Xóa
      </Button>
    </Box>
  )
}

function GlobalDiscountSection({
  appliedProductVoucher, setProductVoucher, clearProductVoucher,
  appliedFreeshipVoucher, setFreeshipVoucher, clearFreeshipVoucher,
  subtotal = 0
}) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [applying, setApplying] = useState(false)

  const { productDiscounts, shippingDiscounts, isLoading } = useDiscounts({
    scope: 'global', status: 'active', search: code
  })

  const hasAnyVoucher = !!appliedProductVoucher || !!appliedFreeshipVoucher

  // Áp dụng theo target của discount
  const handleSelectDiscount = (discount) => {
    if (discount.category === 'freeship') {
      // Toggle: click lại voucher đang dùng thì bỏ
      if (appliedFreeshipVoucher?.id === discount.id) {
        clearFreeshipVoucher()
      } else {
        setFreeshipVoucher(discount)
      }
    } else {
      if (appliedProductVoucher?.id === discount.id) {
        clearProductVoucher()
      } else {
        setProductVoucher(discount)
      }
    }
    setCode('')
  }

  // Áp dụng qua nhập code
  const handleApplyCode = async () => {
    const trimmed = code.trim()
    if (!trimmed) return

    // Tìm trong danh sách đã có sẵn
    const allLoaded = [...productDiscounts, ...shippingDiscounts]
    const found = allLoaded.find(d => d.code?.toUpperCase() === trimmed.toUpperCase())
    if (found) {
      handleSelectDiscount(found)
      return
    }

    // Không tìm thấy local → validate qua API
    setApplying(true)
    try {
      const result = await validateVoucherAPI(trimmed)
      if (result) {
        const raw = Array.isArray(result) ? result[0] : result
        const normalized = normalizeDiscount(raw)
        handleSelectDiscount(normalized)
        toast.success('Áp dụng mã voucher thành công!')
      }
    } catch {
      toast.error('Mã voucher không hợp lệ hoặc đã hết hạn')
    } finally {
      setApplying(false)
    }
  }

  return (
    <Box sx={{
      bgcolor: 'primary.main', ...glassSx, p: 0,
      borderRadius: 3, overflow: 'hidden',
      border: '1px solid', borderColor: 'divider'
    }}>
      {/* Header toggle */}
      <Box
        onClick={() => setOpen(v => !v)}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: 2.5, py: 1.75, cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(83,155,255,0.04)' },
          transition: 'background 0.18s'
        }}
      >
        <Typography sx={{ flex: 1, fontSize: '0.86rem', fontWeight: 600, ...gradientText }}>
          NovaLive voucher
        </Typography>
        {hasAnyVoucher && (
          <CheckCircleRoundedIcon sx={{ fontSize: 15, color: 'success.main' }} />
        )}
        <ExpandMoreRoundedIcon sx={{
          fontSize: 19, color: 'rgba(45,45,45,0.38)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }} />
      </Box>

      <Collapse in={open}>
        <Divider sx={{ borderColor: 'divider' }} />
        <Box sx={{ px: 2.5, py: 1.75, display: 'flex', flexDirection: 'column', gap: 1.5 }}>

          {appliedProductVoucher && (
            <AppliedBadge voucher={appliedProductVoucher} onClear={clearProductVoucher} />
          )}
          {appliedFreeshipVoucher && (
            <AppliedBadge
              voucher={appliedFreeshipVoucher}
              onClear={clearFreeshipVoucher}
              color="#d97706"
              bgColor="rgba(245,158,11,0.06)"
              borderColor="rgba(245,158,11,0.22)"
            />
          )}

          {/* Input nhập code */}
          <TextField
            fullWidth size="small"
            placeholder="Nhập mã voucher toàn sàn..."
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyCode()}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      disabled={!code.trim() || applying}
                      onClick={handleApplyCode}
                      sx={{
                        textTransform: 'none', fontWeight: 600, fontSize: '0.73rem',
                        borderRadius: '7px', py: 0.35, px: 1.4,
                        bgcolor: 'secondary.main', color: '#fff',
                        '&:hover': { bgcolor: '#4e96f6' },
                        '&.Mui-disabled': { bgcolor: 'rgba(0,0,0,0.1)' }
                      }}
                    >
                      {applying ? <CircularProgress size={11} sx={{ color: '#fff' }} /> : 'Áp dụng'}
                    </Button>
                  </InputAdornment>
                )
              }
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f5f7ff', pr: 0.5 } }}
          />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} sx={{ color: 'secondary.main' }} />
            </Box>
          ) : (productDiscounts.length === 0 && shippingDiscounts.length === 0) ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <LocalOfferRoundedIcon sx={{ fontSize: 34, color: 'rgba(45,45,45,0.18)', mb: 0.75, display: 'block', mx: 'auto' }} />
              <Typography sx={{ fontSize: '0.78rem', color: 'rgba(45,45,45,0.42)' }}>Không có voucher toàn sàn</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>

              {/* Nhóm giảm giá sản phẩm — chỉ 1 mã được chọn */}
              {productDiscounts.length > 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.75 }}>
                    <LocalOfferRoundedIcon sx={{ fontSize: 12, color: 'secondary.main' }} />
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(45,45,45,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Giảm sản phẩm
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {productDiscounts.map(d => (
                      <DiscountCardMini
                        key={d.id}
                        discount={d}
                        selected={appliedProductVoucher?.id === d.id}
                        onSelect={() => handleSelectDiscount(d)}
                        subtotal={subtotal}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Nhóm freeship — chỉ 1 mã được chọn */}
              {shippingDiscounts.length > 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.75 }}>
                    <LocalShippingRoundedIcon sx={{ fontSize: 12, color: '#f59e0b' }} />
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(45,45,45,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Freeship
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {shippingDiscounts.map(d => (
                      <DiscountCardMini
                        key={d.id}
                        discount={d}
                        selected={appliedFreeshipVoucher?.id === d.id}
                        onSelect={() => handleSelectDiscount(d)}
                        subtotal={subtotal}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}

export default GlobalDiscountSection
