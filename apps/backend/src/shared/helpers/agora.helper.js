import pkg from 'agora-token'
const { RtcRole, RtcTokenBuilder } = pkg
import { env } from '#infrastructure/config/environment.config.js'

const generateToken = ({ channelName, account, roleType }) => {
  const appId = env.AGORA_APP_ID
  const appCertificate = env.AGORA_APP_CERTIFICATE
  const role = roleType === 'HOST' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER

  const expirationTimeInSeconds = 7200
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

  const token = RtcTokenBuilder.buildTokenWithUserAccount(
    appId,
    appCertificate,
    channelName,
    account,
    role,
    privilegeExpiredTs
  )

  return token
}

export default {
  generateToken
}