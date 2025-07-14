import express from 'express'
import cors from 'cors'
import rideRoutes from './routes/rideRoutes.js'
import authRoutes from './routes/auth.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json()) // Parses JSON bodies

// Routes
app.use('/api/rides', rideRoutes)
app.use('/api/auth', authRoutes)

export default app
