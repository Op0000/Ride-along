// firebase.js
import admin from 'firebase-admin'

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
} else if (!serviceAccount) {
  console.warn('Firebase service account not configured')
}

export default admin
