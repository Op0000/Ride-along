import express from 'express'
import Ride from '../models/Ride.js'
import Booking from '../models/Booking.js'
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import User from '../models/User.js'

const router = express.Router()

// ✅ POST /api/rides — Create a new ride (protected + driver verification)
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const decodedUser = req.user  // From Firebase token
    const dbUser = await User.findOne({ uid: decodedUser.uid })

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    // ⛔ Block ride posting if not a verified driver
    if (!dbUser.driverVerification?.isVerified) {
      return res.status(403).json({ error: 'Driver verification required to post a ride.' })
    }

    const ride = new Ride({
      ...req.body,
      userId: dbUser.uid,
      userEmail: dbUser.email
    })

    await ride.save()
    res.status(201).json({ message: 'Ride posted!', ride })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ✅ GET /api/rides — Search rides with directional filtering
router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query
    const rides = await Ride.find()

    if (!from && !to) return res.json(rides)

    const filtered = rides.filter((ride) => {
      const route = [ride.from, ...(ride.via || []), ride.to].map(loc => loc.toLowerCase())

      if (from && to) {
        const fromIndex = route.indexOf(from.toLowerCase())
        const toIndex = route.indexOf(to.toLowerCase())
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex
      }

      if (from) return route.includes(from.toLowerCase())
      if (to) return route.includes(to.toLowerCase())

      return true
    })

    res.json(filtered)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ GET /api/rides/user/:userId — Get rides posted by a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(rides)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ GET /api/rides/:id — Get single ride by ID
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
    if (!ride) return res.status(404).json({ error: 'Ride not found' })
    res.json(ride)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ DELETE /api/rides/:id — Delete a ride (protected route)
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
    
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' })
    }

    // Check if the user owns this ride
    if (ride.userId !== req.user.uid) {
      return res.status(403).json({ error: 'You can only delete your own rides' })
    }

    // Check if there are any bookings for this ride
    const bookings = await Booking.find({ rideId: req.params.id })
    if (bookings.length > 0) {
      return res.status(400).json({ 
        error: `Cannot delete ride. ${bookings.length} booking(s) exist for this ride.` 
      })
    }

    await Ride.findByIdAndDelete(req.params.id)
    res.json({ message: 'Ride deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
