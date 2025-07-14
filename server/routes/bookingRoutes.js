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

  // 🔥 Add validation for required fields
  if (!userId || !userEmail) {
    return res.status(400).json({ 
      error: 'Validation failed: userId and userEmail are required.' 
    })
  }

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

// ... (keep the existing GET route)
export default router
