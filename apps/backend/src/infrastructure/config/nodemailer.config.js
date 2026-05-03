import nodemailer from 'nodemailer'
import { env } from './environment.config.js'

const transport = nodemailer.createTransport({
  host: env.BREVO_SMTP_HOST,
  port: env.BREVO_SMTP_PORT,
  secure: false,
  auth: {
    user: env.BREVO_SMTP_USER,

    pass: env.BREVO_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

transport.verify((error) => {
  if (error) {
    console.error('Nodemailer connection failed:', error)
  } else {
    console.log('Nodemailer is ready to send emails')
  }
})

export default transport