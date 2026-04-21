import { useCallback, useEffect, useRef, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { startLiveAPI, endLiveAPI } from '~/apis/services/liveService'
import { formatDuration } from '~/utils/formatters'

const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID

export const useLiveHost = ({ liveId, userId }) => {
  const [status, setStatus] = useState('idle') // idle | starting | live | ending | ended | error
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCamOn, setIsCamOn] = useState(true)
  const [duration, setDuration] = useState(0)

  const clientRef = useRef(null)
  const localVideoTrackRef = useRef(null)
  const localAudioTrackRef = useRef(null)
  const videoContainerRef = useRef(null)
  const timerRef = useRef(null)

  //rời khỏi livec
  const stopAllTracks = () => {
    localVideoTrackRef.current?.stop()
    localVideoTrackRef.current?.close()
    localAudioTrackRef.current?.stop()
    localAudioTrackRef.current?.close()
    clientRef.current?.leave()
  }
  useEffect(() => {
    return () => {
      stopAllTracks()
      clearInterval(timerRef.current)
    }
  }, [])

  //useCallback la re-render theo 1 dieu kien nao do thay doi, kh render lien tuc
  const startLive = useCallback(async () => {
    if (!liveId || !userId) return
    setStatus('starting')
    try {
      const { token } = await startLiveAPI(liveId)
      const channelName = liveId.toString()

      const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })
      await client.setClientRole('host')
      clientRef.current = client

      await client.join(AGORA_APP_ID, channelName, token, userId)

      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
      localAudioTrackRef.current = audioTrack
      localVideoTrackRef.current = videoTrack

      videoTrack.play(videoContainerRef.current)

      await client.publish([audioTrack, videoTrack])
      setStatus('live')

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } catch (err) {
      // console.error('startLive error:', err)
      setStatus('error')
    }
  }, [liveId, userId])

  const endLive = useCallback(async () => {
    setStatus('ending')
    try {
      clearInterval(timerRef.current)
      stopAllTracks()
      await endLiveAPI(liveId)
      setStatus('ended')
    } catch (error) {
      console.error('endLive error:', error)
      setStatus('error')
    }
  }, [liveId])

  const toggleMic = useCallback(() => {
    if (!localAudioTrackRef.current) return
    const newState = !isMicOn
    localAudioTrackRef.current.setEnabled(newState)
    setIsMicOn(newState)
  }, [isMicOn])

  const toggleCam = useCallback(() => {
    if (!localVideoTrackRef.current) return
    const newState = !isCamOn
    localVideoTrackRef.current.setEnabled(newState)
    setIsCamOn(newState)
  }, [isCamOn])

  return {
    status, isMicOn,
    isCamOn, videoContainerRef,
    startLive, endLive,
    toggleMic, toggleCam,
    duration: formatDuration(duration)
  }
}