import express from 'express'
import Booking from '../models/Booking.js'
import Ride from '../models/Ride.js'
import { verifyFirebaseToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// ✅ Function to verify reCAPTCHA
const verifyCaptcha = async (captchaToken) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LdlI4UrAAAAANvDGcdMHctyrnXUUBm7QQVlWOu8'
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${captchaToken}`
  })
  const data = await response.json()
  return data.success
}

// ✅ POST /api/bookings - Make a booking (NOW PROTECTED)
router.post('/', verifyFirebaseToken, async (req, res) => {
  const {
    rideId,
    userId,
    userEmail,
    userName,
    userPhone,
    userAge,
    userGender,
    seatsBooked = 1,
    captcha
  } = req.body

  // 🔥 Add validation for required fields
  if (!rideId || !userId || !userEmail) {
    return res.status(400).json({
      error: 'Validation failed: rideId, userId and userEmail are required.'
    })
  }

  // ✅ Verify captcha
  if (!captcha) {
    return res.status(400).json({
      error: 'Captcha verification required.'
    })
  }

  try {
    const captchaValid = await verifyCaptcha(captcha)
    if (!captchaValid) {
      return res.status(400).json({
        error: 'Invalid captcha. Please try again.'
      })
    }
  } catch (captchaError) {
    console.error('Captcha verification error:', captchaError)
    return res.status(500).json({
      error: 'Captcha verification failed. Please try again.'
    })
  }

  // Validate seatsBooked is a positive number
  if (seatsBooked <= 0 || !Number.isInteger(seatsBooked)) {
    return res.status(400).json({
      error: 'seatsBooked must be a positive integer.'
    })
  }

  try {
    // Verify the authenticated user matches the booking user
    if (req.user.uid !== userId) {
      return res.status(403).json({
        error: 'User ID mismatch. You can only book for yourself.'
      })
    }

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

// ✅ GET /api/bookings/user/:userId — Get bookings by a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .sort({ bookedAt: -1 })
    
    // Manually populate ride details and filter out bookings for deleted rides
    const populatedBookings = []
    
    for (const booking of bookings) {
      try {
        const ride = await Ride.findById(booking.rideId)
        if (ride) {
          // Ride still exists, include the booking with ride details
          populatedBookings.push({
            ...booking.toObject(),
            rideId: ride
          })
        } else {
          // Ride was deleted, optionally clean up orphaned booking
          console.log(`Orphaned booking found: ${booking._id} - ride ${booking.rideId} no longer exists`)
          // Uncomment the next line if you want to auto-delete orphaned bookings
          // await Booking.findByIdAndDelete(booking._id)
        }
      } catch (rideError) {
        console.error(`Error fetching ride ${booking.rideId}:`, rideError)
        // Include booking without ride details if there's an error
        populatedBookings.push({
          ...booking.toObject(),
          rideId: null
        })
      }
    }
    
    res.json(populatedBookings)
  } catch (err) {
    console.error('[GET USER BOOKINGS ERROR]', err)
    res.status(500).json({ error: 'Failed to fetch user bookings' })
  }
})

// ✅ DELETE /api/bookings/:id — Cancel a booking (protected route)
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Check if the user owns this booking
    if (booking.userId !== req.user.uid) {
      return res.status(403).json({ error: 'You can only cancel your own bookings' })
    }

    // Get the associated ride to restore seats
    const ride = await Ride.findById(booking.rideId)
    if (ride) {
      ride.seatsAvailable += booking.seatsBooked
      await ride.save()
    }

    await Booking.findByIdAndDelete(req.params.id)
    
    res.json({ 
      message: 'Booking cancelled successfully',
      restoredSeats: booking.seatsBooked
    })
  } catch (err) {
    console.error('[CANCEL BOOKING ERROR]', err)
    res.status(500).json({ error: 'Failed to cancel booking' })
  }
})

export default router
  
