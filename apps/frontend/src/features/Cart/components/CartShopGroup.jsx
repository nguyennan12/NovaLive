import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { Box, Button, Checkbox, Divider, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedIds, setSelectedIds } from '~/common/redux/cart/cartSlice'
import { glassSx } from '~/theme'
import CartItem from './CartItem'


function CartShopGroup({ group }) {
  const { shopName, items } = group
  const dispatch = useDispatch()
  const selectedIds = useSelector(selectSelectedIds)

  const groupSkuIds = items.map(i => String(i.skuId))
  const allGroupSelected = groupSkuIds.length > 0 && groupSkuIds.every(id => selectedIds.includes(id))
  const someGroupSelected = groupSkuIds.some(id => selectedIds.includes(id))

  const handleToggleGroup = () => {
    if (allGroupSelected) {
      // Bỏ chọn toàn bộ items trong shop này
      dispatch(setSelectedIds(selectedIds.filter(id => !groupSkuIds.includes(id))))
    } else {
      // Chọn thêm các items chưa được chọn
      const next = [...new Set([...selectedIds, ...groupSkuIds])]
      dispatch(setSelectedIds(next))
    }
  }

  return (
    <Box sx={{
      bgcolor: 'primary.main',
      ...glassSx, p: 0,
      borderRadius: 3, mb: 2,
      overflow: 'hidden',
      border: '1px solid', borderColor: 'divider'
    }}>
      {/* Shop header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        px: 2, py: 1.25,
        borderBottom: '1px solid', borderColor: 'divider',
        bgcolor: 'rgba(83,155,255,0.04)'
      }}>
        <Checkbox
          checked={allGroupSelected}
          indeterminate={someGroupSelected && !allGroupSelected}
          onChange={handleToggleGroup}
          size="small"
          sx={{ p: 0, flexShrink: 0, color: 'rgba(0,0,0,0.28)', '&.Mui-checked': { color: 'secondary.main' } }}
        />
        <StorefrontRoundedIcon sx={{ fontSize: 17, color: 'secondary.main' }} />
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'primary.contrastText', flex: 1 }}>
          {shopName}
        </Typography>
      </Box>

      {/* Danh sách sản phẩm */}
      <Box sx={{ px: 2 }}>
        {items.map((item, idx) => (
          <Box key={String(item.skuId)}>
            <CartItem item={item} />
            {idx < items.length - 1 && (
              <Divider sx={{ borderColor: 'divider', opacity: 0.7 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* discount của shop */}
      <Box sx={{
        px: 2, py: 1,
        borderTop: '1px solid', borderColor: 'divider',
        display: 'flex', alignItems: 'center', gap: 1,
        bgcolor: 'rgba(245,158,11,0.04)'
      }}>
        <LocalOfferOutlinedIcon sx={{ fontSize: 15, color: 'fourth.main' }} />
        <Typography sx={{ fontSize: '0.76rem', color: 'rgba(45,45,45,0.55)', flex: 1 }}>
          Khuyến mãi từ shop
        </Typography>
        <Button
          size="small"
          sx={{
            fontSize: '0.74rem', fontWeight: 600, color: 'fourth.main',
            textTransform: 'none', py: 0.25, px: 1.25, minWidth: 'unset',
            '&:hover': { bgcolor: 'rgba(245,158,11,0.08)' }
          }}
        >
          Chọn mã
        </Button>
      </Box>
    </Box>
  )
}

export default CartShopGroup
