// client/src/firebase.js
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider
} from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
}

// ✅ Initialize Firebase and Auth
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// ✅ Set persistence (browser local storage)
setPersistence(auth, browserLocalPersistence).catch(console.error)

export const storage = getStorage(app)
// ✅ Optional: export provider if needed
export const provider = new GoogleAuthProvider()
