import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// ✅ Save or Update user profile
router.post('/save', async (req, res) => {
  const { uid, name, age, gender, email, phone } = req.body

  try {
    const updated = await User.findOneAndUpdate(
      { uid },
      { name, age, gender, email, phone },
      { new: true, upsert: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to save user' })
  }
})

// ✅ Get user by UID
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid })
    res.json(user || {})
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

export default router
