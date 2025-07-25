import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import app from './app.js'
import Ride from './models/Ride.js'
import cron from 'node-cron'

const PORT = process.env.PORT || 5000

// Enable CORS
app.use(cors())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected')

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })

    // 🔁 Cron Job: Delete expired rides every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
      const now = new Date()
      try {
        const deleted = await Ride.deleteMany({ departureTime: { $lt: now } })
        console.log(`🗑️ Deleted ${deleted.deletedCount} expired rides`)
      } catch (err) {
        console.error('❌ Error deleting expired rides:', err.message)
      }
    })

  })
  .catch(err => console.error('❌ MongoDB connection failed:', err))
