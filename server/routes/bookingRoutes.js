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
    userGender,
    seatsBooked = 1
  } = req.body

  // 🔥 Add validation for required fields
  if (!rideId || !userId || !userEmail) {
    return res.status(400).json({
      error: 'Validation failed: rideId, userId and userEmail are required.'
    })
  }

  // Validate seatsBooked is a positive number
  if (seatsBooked <= 0 || !Number.isInteger(seatsBooked)) {
    return res.status(400).json({
      error: 'seatsBooked must be a positive integer.'
    })
  }

  try {
    // Check if ride exists and has enough seats
    const ride = await Ride.findById(rideId)
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' })
    }

    if (ride.seatsAvailable < seatsBooked) {
      return res.status(400).json({ 
        error: `Not enough seats available. Only ${ride.seatsAvailable} seats left.` 
      })
    }

    // Check if user already booked this ride
    const existingBooking = await Booking.findOne({ rideId, userId })
    if (existingBooking) {
      return res.status(400).json({ 
        error: 'You have already booked this ride.' 
      })
    }

    // Update seat count
    ride.seatsAvailable -= seatsBooked
    await ride.save()

    // Create booking
    const booking = new Booking({
      rideId,
      userId,
      userEmail,
      userName,
      userPhone,
      userAge,
      userGender,
      seatsBooked
    })

    await booking.save()

    res.status(201).json({ 
      message: 'Booking successful', 
      booking,
      remainingSeats: ride.seatsAvailable
    })

  } catch (err) {
    console.error('[BOOKING ERROR]', err)
    res.status(500).json({ error: 'Internal server error. Please try again.' })
  }
})

export default router
