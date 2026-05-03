import mongoose from 'mongoose'
import mongodbConfig from '#infrastructure/config/mongodb.config.js'

const { url, maxPoolSize } = mongodbConfig.db

const connectDB = async () => {
  try {
    if (!url) {
      throw new Error('Missing MongoDB URL. Check .env and NODE_ENV config.')
    }

    await mongoose.connect(url, { maxPoolSize, dbName: 'ecommerce' })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

export default connectDB