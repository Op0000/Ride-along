import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import './firebase.js'

import Home from './pages/Home.jsx'
import PostRide from './pages/PostRide.jsx'
import SearchRides from './pages/SearchRide.jsx'
import RideDetail from './pages/RideDetail.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const auth = getAuth()
  const dropdownRef = useRef()
  const navigate = useNavigate()

  // Track auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [auth])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setDropdownOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>

  return (
    <div>
      <nav className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">Ride Along</Link>
        <div className="space-x-4 flex items-center relative" ref={dropdownRef}>
          <Link to="/post">Post Ride</Link>
          <Link to="/search">Search</Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="font-semibold hover:underline"
              >
                {user.displayName || 'User'}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
