// client/src/firebase.js
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider
} from 'firebase/auth'

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDi263BYC5vuqljXaEY_WPj_06gZdt9PqY",
  authDomain: "ride-along-a36bb.firebaseapp.com",
  projectId: "ride-along-a36bb",
  storageBucket: "ride-along-a36bb.appspot.com",
  messagingSenderId: "658827950786",
  appId: "1:658827950786:web:9c01fe7067e5601cbf995b"
}

// ✅ Initialize Firebase and Auth
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// ✅ Set persistence (browser local storage)
setPersistence(auth, browserLocalPersistence).catch(console.error)

// ✅ Optional: export provider if needed
export const provider = new GoogleAuthProvider()
