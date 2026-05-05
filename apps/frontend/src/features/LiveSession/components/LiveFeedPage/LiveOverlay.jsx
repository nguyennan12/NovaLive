import { Box } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/store/user/userSlice'
import { useLiveSocket } from '../../hooks/useLiveSocket'
import LiveComments from './LiveComments'
import LiveHeaderInfo from './LiveHeaderInfo'
import LiveStats from './LiveStats'
import PinnedProductCard from './PinnedProductCard'
import ProductDetailSheet from './ProductDetailSheet'

const LiveOverlay = ({ live }) => {
  const currentUser = useSelector(selectCurrentUser)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetProduct, setSheetProduct] = useState(null)
  console.log("🚀 ~ LiveOverlay ~ sheetProduct:", sheetProduct)

  const { viewers, likes, comments, pinnedProduct, sendLike, sendComment, commentError } = useLiveSocket({
    liveCode: live?.live_code,
    userId: currentUser?._id,
    userName: currentUser?.user_name ?? currentUser?.user_email ?? 'Khách',
    avatar: currentUser?.user_avatar,
    liveProducts: live?.live_products ?? [],
    initialViewers: live?.live_metrics?.viewer_count ?? 0,
    initialLikes: live?.live_metrics?.total_likes ?? 0
  })

  const handleOpenSheet = (product) => {
    setSheetProduct(product)
    setSheetOpen(true)
  }

  return (
    <>
      <Box sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
        borderRadius: 'inherit'
      }}>
        <LiveHeaderInfo live={live} />

        <LiveStats
          viewers={viewers}
          likes={likes}
          onLike={sendLike}
        />

        <PinnedProductCard
          product={pinnedProduct}
          onClick={() => pinnedProduct && handleOpenSheet(pinnedProduct)}
        />

        <LiveComments
          comments={comments}
          onSend={sendComment}
          commentError={commentError}
        />
      </Box>

      {/* Bottom sheet nằm ngoài overlay để không bị pointer-events: none */}
      <ProductDetailSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        product={sheetProduct}
      />
    </>
  )
}

export default LiveOverlay
