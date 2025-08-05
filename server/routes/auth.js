//Secure Sign-in
import express from 'express'
import admin from '../firebase.js'
import User from '../models/user.js' // assuming userSchema is exported from models/user.js

const router = express.Router()

router.post('/verify-token', async (req, res) => {
  const { idToken, name, age, gender, phone } = req.body

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const { uid, email } = decodedToken

    // Check if user already exists in MongoDB
    let user = await User.findOne({ uid })

    if (!user) {
      // Create new user
      user = new User({
        uid,
        name: name || '', // Optional fields
        age: age || null,
        gender: gender || '',
        email,
        phone: phone || '',
      })

      await user.save()
    }

    res.json({ success: true, uid, email })
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
