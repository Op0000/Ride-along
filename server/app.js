import express from 'express'
import cors from 'cors'
import rideRoutes from './routes/rideRoutes.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import bookingRoutes from './routes/bookingRoutes.js'
import liveLocationRoutes from './routes/liveLocationRoutes.js'
import supportRoutes from './routes/supportRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import verifyRoutes from './routes/verifyRoutes.js'

const app = express()

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'https://ride-along.xyz', 'https://www.ride-along.xyz'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()) // Parses JSON bodies

app.use('/api/bookings', (req, res, next) => {
  console.log('[BOOKING PAYLOAD]', req.body)
  next()
}) // Debug

// Routes
app.use('/api/verify', verifyRoutes)
app.use('/api/support', supportRoutes)
app.use('/api/rides', rideRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/live-location', liveLocationRoutes)
app.use('/api/upload', uploadRoutes)

export default app