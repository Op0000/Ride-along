import express from 'express'
import Ride from '../models/Ride.js'

const router = express.Router()

// POST /api/rides — Create a new ride
router.post('/', async (req, res) => {
  try {
    const ride = new Ride(req.body)
    await ride.save()
    res.status(201).json({ message: 'Ride posted!', ride })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET /api/rides — Get all rides or search
router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query

    let query = {}
    if (from) query.from = new RegExp(from, 'i')
    if (to) {
      query.$or = [
        { to: new RegExp(to, 'i') },
        { via: new RegExp(to, 'i') }
      ]
    }

    const rides = await Ride.find(query)
    res.json(rides)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
