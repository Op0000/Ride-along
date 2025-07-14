// client/src/pages/Login.jsx
import { auth, googleProvider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import { useEffect } from 'react'

export default function Login({ onLogin }) {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const token = await user.getIdToken()
      onLogin({ user, token })
    } catch (err) {
      console.error('Login failed:', err.message)
    }
  }

  useEffect(() => {
    // auto-login if already signed in
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken()
        onLogin({ user, token })
      }
    })
  }, [])

  return (
    <div className="text-center mt-20 text-white">
      <h1 className="text-3xl font-bold mb-4 text-purple-400">Login to Ride Along</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white text-lg"
      >
        Sign in with Google
      </button>
    </div>
  )
}
