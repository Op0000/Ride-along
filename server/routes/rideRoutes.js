import express from 'express'
import Ride from '../models/Ride.js'

const router = express.Router()

// ✅ POST /api/rides — Create a new ride
router.post('/', async (req, res) => {
  try {
    const newRide = new Ride(req.body)
    await newRide.save()
    res.status(201).json({ message: 'Ride posted!', ride: newRide })
  } catch (err) {
    console.error('POST /api/rides error:', err)
    res.status(500).json({ error: 'Failed to post ride' })
  }
})

// (We'll add the search logic later here)
export default router
