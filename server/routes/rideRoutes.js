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

// ✅ GET /api/rides — Search rides
router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query

    let query = {}
    if (from) query.from = new RegExp(from, 'i') // case-insensitive match
    if (to) {
      query.$or = [
        { to: new RegExp(to, 'i') },
        { via: new RegExp(to, 'i') } // to match routes that pass through
      ]
    }

    const rides = await Ride.find(query)
    res.json(rides)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/rides/:id — Get single ride by ID
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' })
    }
    res.json(ride)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
export default router
