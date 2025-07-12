import express from 'express'
import cors from 'cors'
import rideRoutes from './routes/rideRoutes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json()) // Parses JSON bodies

// Routes
app.use('/api/rides', rideRoutes)

export default app
