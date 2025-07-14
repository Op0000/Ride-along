// client/src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDi263BYC5vuqljXaEY_WPj_06gZdt9PqY",
  authDomain: "ride-along-a36bb.firebaseapp.com",
  projectId: "ride-along-a36bb",
  storageBucket: "ride-along-a36bb.firebasestorage.app",
  messagingSenderId: "658827950786",
  appId: "1:658827950786:web:9c01fe7067e5601cbf995b"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
