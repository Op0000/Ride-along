import express from 'express'
import cors from 'cors'
import rideRoutes from './routes/rideRoutes.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import bookingRoutes from './routes/bookingRoutes.js'
import liveLocationRoutes from './routes/liveLocationRoutes.js'
import supportRoutes from './routes/supportRoutes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json()) // Parses JSON bodies

app.use('/api/bookings', (req, res, next) => {
  console.log('[BOOKING PAYLOAD]', req.body)
  next()
}) // Debug
// Routes
app.use("/api/verify", require("./routes/verifyRoutes"));
app.use('/api/support', supportRoutes)
app.use('/api/rides', rideRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/live-location', liveLocationRoutes)
export default app
