import { Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import './firebase.js'

import Home from './pages/Home.jsx'
import PostRide from './pages/PostRide.jsx'
import SearchRides from './pages/SearchRide.jsx'
import RideDetail from './pages/RideDetail.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [auth])

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' }) // force account picker
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>

  return (
    <div>
      <nav className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">Ride Along</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/post">Post Ride</Link>
          <Link to="/search">Search</Link>
          {user ? (
            <>
              <span className="text-sm">Hi, {user.displayName || 'User'}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-white text-blue-600 px-3 py-1 rounded font-semibold"
            >
              Login with Google
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<PostRide />} />
        <Route path="/search" element={<SearchRides />} />
        <Route path="/ride/:id" element={<RideDetail />} />
      </Routes>
    </div>
  )
}

export default App
