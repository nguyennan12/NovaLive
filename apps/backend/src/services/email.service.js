import { env } from '#config/environment.config.js'
import { htmlEmailToken } from '#utils/email.html.js'
import transport from '#config/nodemailer.config.js'
import otpService from './otp.service.js'

const sendVerificationEmail = async ({ email }) => {
  const otpToken = await otpService.createOtp({ email })
  const verifyUrl = `${env.BASE_URL_LOCAL}/verify-account?token=${otpToken}&email=${email}`
  const html = htmlEmailToken(verifyUrl, otpToken)
  const subject = 'Xác thực tài khoản của bạn'
  try {
    const mailOptions = {
      from: env.EMAIL_FROM || 'Livestream App <nguyenan1204@gmail.com>',
      to: email,
      subject,
      html,
    }
    return await transport.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
    return null
  }
}
export default {
  sendVerificationEmail
}