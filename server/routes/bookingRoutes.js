import express from 'express'
import Booking from '../models/Booking.js'
import Ride from '../models/Ride.js'

const router = express.Router()

// ✅ POST /api/bookings - Make a booking
router.post('/', async (req, res) => {
  const { rideId, userId, name, age, gender, phone, email } = req.body

  try {
    const ride = await Ride.findById(rideId)
    if (!ride) return res.status(404).json({ error: 'Ride not found' })
    if (ride.seatsAvailable <= 0) return res.status(400).json({ error: 'No seats available' })

    // Reduce seat count
    ride.seatsAvailable -= 1
    await ride.save()

    // Save booking
    const booking = new Booking({
      rideId,
      userId,
      seatsBooked: 1,
      name,
      age,
      gender,
      phone,
      email
    })

    await booking.save()

    res.status(201).json({ message: 'Booking successful', booking })
  } catch (err) {
    console.error('[BOOKING ERROR]', err)
    res.status(500).json({ error: 'Server error during booking' })
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
