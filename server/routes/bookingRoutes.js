import express from 'express'
import Booking from '../models/Booking.js'
import Ride from '../models/Ride.js'

const router = express.Router()

// ✅ POST /api/bookings/book - Make a booking
router.post('/book', async (req, res) => {
  try {
    const {
      rideId,
      userId,
      name,
      age,
      gender,
      phone,
      email,
      seatsBooked = 1
    } = req.body

    if (!rideId || !userId || !name || !age || !gender || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const ride = await Ride.findById(rideId)
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' })
    }

    if (ride.seatsAvailable < seatsBooked) {
      return res.status(400).json({ error: 'Not enough seats available' })
    }

    // Prevent duplicate bookings
    const alreadyBooked = await Booking.findOne({ rideId, userId })
    if (alreadyBooked) {
      return res.status(400).json({ error: 'You already booked this ride' })
    }

    // Create and save booking
    const booking = new Booking({
      rideId,
      userId,
      name,
      age,
      gender,
      phone,
      email,
      seatsBooked
    })
    await booking.save()

    // Reduce seat count
    ride.seatsAvailable -= seatsBooked
    await ride.save()

    res.status(201).json({ message: 'Booking successful', booking })
  } catch (err) {
    console.error('[BOOKING ERROR]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ✅ GET /api/bookings/user/:uid - Fetch bookings for a user
router.get('/user/:uid', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.uid }).populate('rideId')
    res.json(bookings)
  } catch (err) {
    console.error('[FETCH BOOKINGS ERROR]', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
