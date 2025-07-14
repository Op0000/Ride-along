//Security
// middlewares/authMiddleware.js
import admin from '../firebase.js'

export const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]

  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
