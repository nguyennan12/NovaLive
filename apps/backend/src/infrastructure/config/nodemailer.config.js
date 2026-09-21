import nodemailer from 'nodemailer'
import { env } from './environment.config.js'

const smtpPort = parseInt(env.BREVO_SMTP_PORT) || 465
const isSecure = smtpPort === 465

const transport = nodemailer.createTransport({
  host: env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
  port: smtpPort,
  secure: isSecure,
  auth: {
    user: env.BREVO_SMTP_USER,
    pass: env.BREVO_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, // 10s max timeout to prevent hanging
  greetingTimeout: 10000,
  socketTimeout: 10000
})

transport.verify((error) => {
  if (error) {
    console.error('Nodemailer connection failed:', error)
  } else {
    console.log('Nodemailer is ready to send emails')
  }
})

export default transport