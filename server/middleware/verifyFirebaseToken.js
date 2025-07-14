// server/middleware/verifyFirebaseToken.js
import admin from 'firebase-admin'

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Token verification failed:', error)
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}
