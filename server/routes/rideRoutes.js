import express from 'express'
import Ride from '../models/Ride.js'
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'

const router = express.Router()

// ✅ POST /api/rides — Create a new ride (protected route)
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const user = req.user
    console.log('[POST RIDE]', {
      user,
      body: req.body
    })

    const ride = new Ride({
      ...req.body,
      userId: user.uid,
      userEmail: user.email
    })

    await ride.save()
    console.log('[POST RIDE SUCCESS]', ride)
    res.status(201).json({ message: 'Ride posted!', ride })
  } catch (err) {
    console.error('[POST RIDE ERROR]', err)
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
