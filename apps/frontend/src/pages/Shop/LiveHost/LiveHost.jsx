import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import EndCofirmDialog from './Component/EndCofirmDialog'
import LiveControls from './Component/LiveControls'
import LiveEndScreen from './Component/LiveEndScreen'
import LiveHeader from './Component/LiveHeader'
import LiveStartScreen from './Component/LiveStartScreen'
import { useLiveHost } from '~/hooks/Live/useLiveHost'

const LiveHost = ({ liveId }) => {
  const currentUser = useSelector(selectCurrentUser)
  const [confirmEnd, setConfirmEnd] = useState(false)

  const {
    status, isMicOn,
    isCamOn, duration,
    videoContainerRef,
    startLive, endLive,
    toggleMic, toggleCam
  } = useLiveHost({ liveId, userId: currentUser?._id })


  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      maxWidth: 480,
      height: '100vh',
      mx: 'auto',
      bgcolor: '#1e1e1e',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box ref={videoContainerRef} sx={{ flex: 1, width: '100%', bgcolor: '#111', position: 'relative' }} />

      {status === 'idle' && <LiveStartScreen startLive={startLive} />}

      {status === 'live' && (
        <>
          < LiveHeader duration={duration} />
          <LiveControls toggleMic={toggleMic} isMicOn={isMicOn} setConfirmEnd={setConfirmEnd} toggleCam={toggleCam} isCamOn={isCamOn} />
        </>
      )}
      {status === 'ended' && (<LiveEndScreen duration={duration} />)}

      <EndCofirmDialog confirmEnd={confirmEnd} setConfirmEnd={setConfirmEnd} endLive={endLive} />
    </Box>
  )
}

export default LiveHost