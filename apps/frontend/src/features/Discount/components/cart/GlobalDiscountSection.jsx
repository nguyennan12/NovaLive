import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import {
  Box, Button, CircularProgress, Collapse, Divider,
  InputAdornment, Tab, Tabs, TextField, Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { validateVoucherAPI } from '~/common/apis/services/cartService'
import { queryDiscountAPI } from '~/common/apis/services/discountService'
import { formatVND } from '~/common/utils/formatters'
import { glassSx } from '~/theme'
import { normalizeDiscount } from '../../utils/normalizeDiscount'
import { DiscountCardMini } from './DiscountCardMini'

function GlobalDiscountSection({ appliedVoucher, setVoucher, clearVoucher, subtotal = 0 }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(0) // 0 = nhập mã, 1 = chọn mã
  const [code, setCode] = useState('')
  const [applying, setApplying] = useState(false)

  // Fetch danh sách voucher toàn sàn khi mở tab "chọn mã"
  const { data: globalDiscounts = [], isLoading: loadingGlobal } = useQuery({
    queryKey: ['discounts', 'global', 'active'],
    queryFn: () => queryDiscountAPI({ scope: 'global', status: 'active' }),
    enabled: open && view === 1,
    staleTime: 2 * 60 * 1000,
    select: (raw) => {
      const list = Array.isArray(raw) ? raw : raw?.items ?? []
      return list.map(normalizeDiscount).filter(d => d.status === 'active')
    }
  })

  // globalDiscounts đã qua normalizeDiscount → category: 'product' | 'freeship'
  const productVouchers = globalDiscounts.filter(d => d.category === 'product')
  const freeshipVouchers = globalDiscounts.filter(d => d.category === 'freeship')

  const handleApplyCode = async () => {
    const trimmed = code.trim()
    if (!trimmed) return
    setApplying(true)
    try {
      const result = await validateVoucherAPI(trimmed)
      if (result) {
        const raw = Array.isArray(result) ? result[0] : result
        setVoucher(normalizeDiscount(raw))
        setOpen(false)
        setCode('')
        toast.success('Áp dụng mã voucher thành công!')
      }
    } catch {
      toast.error('Mã voucher không hợp lệ hoặc đã hết hạn')
    } finally {
      setApplying(false)
    }
  }

  const handleSelectDiscount = (discount) => {
    setVoucher(discount)
    setOpen(false)
  }

  const handleRemove = () => {
    clearVoucher()
    setCode('')
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
        <LocalOfferRoundedIcon sx={{ fontSize: 17, color: 'secondary.main' }} />
        <Typography sx={{ flex: 1, fontSize: '0.86rem', fontWeight: 600, color: 'primary.contrastText' }}>
          Voucher toàn sàn
        </Typography>
        {appliedVoucher && (
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

          {/* Applied voucher display */}
          {appliedVoucher && (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              px: 1.5, py: 1, borderRadius: 2,
              bgcolor: 'rgba(52,133,247,0.06)',
              border: '1px solid rgba(52,133,247,0.18)'
            }}>
              <CheckCircleRoundedIcon sx={{ fontSize: 14, color: 'success.main', flexShrink: 0 }} />
              <Typography sx={{ flex: 1, fontSize: '0.78rem', color: 'success.main', fontWeight: 600 }}>
                {appliedVoucher.code} — Giảm&nbsp;
                {appliedVoucher.type === 'percentage'
                  ? `${appliedVoucher.value}%`
                  : formatVND(appliedVoucher.value)
                }
              </Typography>
              <Button
                size="small" color="error"
                onClick={handleRemove}
                sx={{ textTransform: 'none', fontSize: '0.7rem', py: 0.2, minWidth: 'unset' }}
              >
                Xóa
              </Button>
            </Box>
          )}

          {/* View tabs */}
          <Tabs
            value={view}
            onChange={(_, v) => setView(v)}
            sx={{
              minHeight: 32,
              borderBottom: '1px solid', borderColor: 'divider',
              '& .MuiTab-root': { textTransform: 'none', fontSize: '0.78rem', minHeight: 32, py: 0.4, px: 1.5 },
              '& .MuiTabs-indicator': { bgcolor: 'secondary.main', height: 2 }
            }}
          >
            <Tab label="Nhập mã" />
            <Tab label={`Chọn mã${globalDiscounts.length ? ` (${globalDiscounts.length})` : ''}`} />
          </Tabs>

          {/* Tab 0: nhập mã */}
          {view === 0 && (
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
                        {applying
                          ? <CircularProgress size={11} sx={{ color: '#fff' }} />
                          : 'Áp dụng'
                        }
                      </Button>
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px', fontSize: '0.82rem', bgcolor: '#f5f7ff', pr: 0.5
                }
              }}
            />
          )}

          {/* Tab 1: duyệt danh sách toàn sàn */}
          {view === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {loadingGlobal ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={24} sx={{ color: 'secondary.main' }} />
                </Box>
              ) : globalDiscounts.length === 0 ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <LocalOfferRoundedIcon sx={{ fontSize: 34, color: 'rgba(45,45,45,0.18)', mb: 0.75, display: 'block', mx: 'auto' }} />
                  <Typography sx={{ fontSize: '0.78rem', color: 'rgba(45,45,45,0.42)' }}>
                    Không có voucher toàn sàn
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {/* Nhóm sản phẩm */}
                  {productVouchers.length > 0 && (
                    <Box>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(45,45,45,0.45)', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Giảm sản phẩm
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {productVouchers.map(d => (
                          <DiscountCardMini
                            key={d._id} discount={d}
                            selected={appliedVoucher?.id === d.id}
                            onSelect={() => handleSelectDiscount(d)}
                            subtotal={subtotal}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Nhóm freeship */}
                  {freeshipVouchers.length > 0 && (
                    <Box>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(45,45,45,0.45)', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Freeship
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {freeshipVouchers.map(d => (
                          <DiscountCardMini
                            key={d.id} discount={d}
                            selected={appliedVoucher?.id === d.id}
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
          )}
        </Box>
      </Collapse>
    </Box>
  )
}

export default GlobalDiscountSection
