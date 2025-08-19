import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import cors from 'cors'
import app from './app.js'
import Ride from './models/Ride.js'
import cron from 'node-cron'

const PORT = process.env.PORT || 5000

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
if (!mongoUri) {
  console.error('❌ No MongoDB URI found in environment variables')
  process.exit(1)
}

mongoose.connect(mongoUri, {
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

        // 🟢 Ping Better Stack (Heartbeat)
        await fetch('https://uptime.betterstack.com/api/v1/heartbeat/YKUZeZrCpWUGW8VPf9aQPKPc')
        console.log('📡 Better Uptime heartbeat pinged successfully')

        // 📄 Log to Better Stack (Logtail)
        await fetch('https://in.logs.betterstack.com/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer zYYc13H3vGc764EyEXMVR9oU'
          },
          body: JSON.stringify({
            dt: new Date().toISOString(),
            message: `Cron ran: Deleted ${deleted.deletedCount} expired rides at ${new Date().toISOString()}`
          })
        })
        console.log('📝 Logged cron action to Better Stack Logtail')
      } catch (err) {
        console.error('❌ Error deleting expired rides:', err.message)
      }
    })

  })
  .catch(err => console.error('❌ MongoDB connection failed:', err))
