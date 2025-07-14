import express from 'express'
import cors from 'cors'
import rideRoutes from './routes/rideRoutes.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json()) // Parses JSON bodies

// Routes
app.use('/api/rides', rideRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
export default app
