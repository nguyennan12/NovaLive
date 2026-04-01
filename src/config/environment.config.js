import 'dotenv/config'

export const env = {
  DEV_MONGODB_URI: process.env.DEV_MONGODB_URI,
  DEV_MONGODB_MAX_POOL_SIZE: process.env.DEV_MONGODB_MAX_POOL_SIZE,
  PRO_MONGODB_URI: process.env.PRO_MONGODB_URI,
  PRO_MONGODB_MAX_POOL_SIZE: process.env.PRO_MONGODB_MAX_POOL_SIZE,

  AUTHOR: process.env.AUTHOR,
  PORT: process.env.PORT,
  HOST: process.env.HOST,

  BASE_URL_LOCAL: process.env.BASE_URL_LOCAL,

  NODE_ENV: process.env.NODE_ENV,

  BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST,
  BREVO_SMTP_PORT: process.env.BREVO_SMTP_PORT,
  BREVO_SMTP_USER: process.env.BREVO_SMTP_USER,
  BREVO_SMTP_PASS: process.env.BREVO_SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM
}