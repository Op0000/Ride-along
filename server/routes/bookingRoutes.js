import express from 'express'
import Booking from '../models/Booking.js'
import Ride from '../models/Ride.js'

const router = express.Router()

// ✅ POST /api/bookings - Make a booking
router.post('/', async (req, res) => {
  const { rideId, userId, seatsBooked, contactPhone } = req.body

  try {
    const ride = await Ride.findById(rideId)
    if (!ride || ride.seatsAvailable < seatsBooked) {
      return res.status(400).json({ error: 'Insufficient seats or ride not found' })
    }

    ride.seatsAvailable -= seatsBooked
    await ride.save()

    const booking = new Booking({ rideId, userId, seatsBooked, contactPhone })
    await booking.save()

    res.status(201).json({ message: 'Booking successful', booking })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ GET /api/bookings/user/:uid - Fetch bookings for a user
router.get('/user/:uid', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.uid }).populate('rideId')
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
