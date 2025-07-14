//Secure Sign-in
import express from 'express'
import admin from '../firebase.js'

const router = express.Router()

// Verify ID Token sent from client (for example)
router.post('/verify-token', async (req, res) => {
  const { idToken } = req.body

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    res.json({ uid: decodedToken.uid, email: decodedToken.email })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
