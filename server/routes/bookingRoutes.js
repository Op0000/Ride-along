import express from 'express'
import Booking from '../models/Booking.js'
import Ride from '../models/Ride.js'

const router = express.Router()

// ✅ POST /api/bookings - Make a booking
router.post('/', async (req, res) => {
  const {
    rideId,
    userId,
    userEmail,
    userName,
    userPhone,
    userAge,
    userGender
  } = req.body

  try {
    const ride = await Ride.findById(rideId)
    if (!ride || ride.seatsAvailable < 1) {
      return res.status(400).json({ error: 'Ride not found or no seats left' })
    }

    // Update seat count
    ride.seatsAvailable -= 1
    await ride.save()

    const booking = new Booking({
      rideId,
      userId,
      userEmail,
      userName,
      userPhone,
      userAge,
      userGender,
      seatsBooked: 1
    })

    await booking.save()

    res.status(201).json({ message: 'Booking successful', booking })
  } catch (err) {
    console.error('[BOOKING ERROR]', err)
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
console.log('[BOOKING REQUEST]', req.body);
export default router
