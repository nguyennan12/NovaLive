import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { Box, Button, Checkbox, Typography } from '@mui/material'
import { useCart } from '../hooks/useCart'
import CartShopGroup from './CartShopGroup'

function CartList() {
  const {
    allItems, selectedIds, shopGroups,
    isAllSelected, selectAll, deselectAll, removeSelected
  } = useCart()

  if (allItems.length === 0) {
    return (
      <Box sx={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        py: 12, gap: 2
      }}>
        <ShoppingCartOutlinedIcon sx={{ fontSize: 68, color: 'rgba(45,45,45,0.18)' }} />
        <Typography sx={{
          color: 'rgba(45,45,45,0.38)', fontSize: '0.95rem', fontWeight: 500
        }}>
          Giỏ hàng của bạn đang trống
        </Typography>
      </Box>
    )
  }

  const handleToggleAll = () => {
    if (isAllSelected) deselectAll()
    else selectAll()
  }

  return (
    <Box>
      {/* Thanh hành động trên cùng */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        mb: 1.5, px: 0.5
      }}>
        <Checkbox
          checked={isAllSelected}
          indeterminate={selectedIds?.length > 0 && !isAllSelected}
          onChange={handleToggleAll}
          size="small"
          sx={{
            p: 0,
            color: 'rgba(0,0,0,0.28)',
            '&.Mui-checked': { color: 'secondary.main' }
          }}
        />
        <Typography sx={{
          fontSize: '0.82rem', color: 'rgba(45,45,45,0.6)',
          flex: 1, userSelect: 'none'
        }}>
          Tất cả ({allItems?.length} sản phẩm)
        </Typography>

        {selectedIds?.length > 0 && (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteSweepRoundedIcon sx={{ fontSize: 17 }} />}
            onClick={removeSelected}
            sx={{
              textTransform: 'none', fontSize: '0.78rem',
              py: 0.3, fontWeight: 600
            }}
          >
            Xóa đã chọn ({selectedIds.length})
          </Button>
        )}
      </Box>

      {/* Nhóm sản phẩm theo shop */}
      {shopGroups.map(group => (
        <CartShopGroup key={group.shopId} group={group} />
      ))}
    </Box>
  )
}

export default CartList
