import express from 'express'
import multer from 'multer'
import Ride from '../models/Ride.js'
import Booking from '../models/Booking.js'
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'
import User from '../models/User.js'

// Configure multer for vehicle photos
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per photo
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG images are allowed'), false)
    }
  }
})

const router = express.Router()

// ✅ POST /api/rides - Create a new ride (public, no verification required)
router.post('/', verifyFirebaseToken, upload.array('vehiclePhotos', 5), async (req, res) => {
  try {
    console.log('🚗 Creating new ride...')
    console.log('Request body:', req.body)
    console.log('User from token:', req.user)
    console.log('Vehicle photos:', req.files?.length || 0)

    const {
      from, to, via = [], price, seatsAvailable,
      driverName, driverContact, vehicleNumber, departureTime
    } = req.body

    // Validation
    if (!from || !to || !price || !seatsAvailable || !driverName || !driverContact || !vehicleNumber || !departureTime) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Process vehicle photos
    let vehiclePhotos = []
    if (req.files && req.files.length > 0) {
      vehiclePhotos = req.files.map(file => ({
        data: file.buffer.toString('base64'),
        contentType: file.mimetype,
        filename: file.originalname,
        uploadedAt: new Date()
      }))
    }

    const ride = new Ride({
      from, to, via, price, seatsAvailable,
      driverName, driverContact, vehicleNumber, departureTime,
      vehiclePhotos,
      userId: req.user.uid,
      userEmail: req.user.email
    })

    await ride.save()
    console.log('✅ Ride created successfully:', ride._id)

    res.status(201).json({
      message: 'Ride posted successfully!',
      ride
    })
  } catch (error) {
    console.error('❌ Error creating ride:', error)
    res.status(500).json({ error: 'Failed to create ride', details: error.message })
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

// ✅ GET /api/rides/:id/photo/:photoIndex — Serve vehicle photo
router.get('/:id/photo/:photoIndex', async (req, res) => {
  try {
    const { id, photoIndex } = req.params
    const ride = await Ride.findById(id)

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' })
    }

    const index = parseInt(photoIndex)
    if (isNaN(index) || index < 0 || index >= ride.vehiclePhotos.length) {
      return res.status(404).json({ error: 'Photo not found' })
    }

    const photo = ride.vehiclePhotos[index]
    const imageBuffer = Buffer.from(photo.data, 'base64')

    res.set({
      'Content-Type': photo.contentType,
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=86400' // Cache for 1 day
    })

    res.send(imageBuffer)
  } catch (err) {
    console.error('Error serving photo:', err)
    res.status(500).json({ error: 'Error serving photo' })
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