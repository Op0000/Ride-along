import express from 'express'
import Ride from '../models/Ride.js'

const router = express.Router()

// ✅ POST /api/rides — Create a new ride
router.post('/', async (req, res) => {
  try {
    const ride = new Ride(req.body)
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

    // If no filter, return all rides
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

export default router
