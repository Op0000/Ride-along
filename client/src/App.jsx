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

// ✅ Import your legal pages
import Terms from './pages/Terms.jsx'
import Privacy from './pages/Privacy.jsx'
import Refund from './pages/Refund.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const auth = getAuth()
  const dropdownRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [auth])

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
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <Link to="/post" className="hover:underline">Post Ride</Link>
          <Link to="/search" className="hover:underline">Search</Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-white text-blue-600 font-semibold px-3 py-1 rounded hover:bg-blue-100 transition"
              >
                {user.displayName?.split(' ')[0] || 'User'} ⌄
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-blue-700 rounded shadow-lg z-50 animate-fade-in-down">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-blue-100 transition"
                  >
                    👤 Profile
                  </Link>
                  <hr className="my-1" />
                  <Link
                    to="/terms"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-blue-100 transition"
                  >
                    📜 Terms & Conditions
                  </Link>
                  <Link
                    to="/privacy"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-blue-100 transition"
                  >
                    🔒 Privacy Policy
                  </Link>
                  <Link
                    to="/refund"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-blue-100 transition"
                  >
                    💸 Refund Policy
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-blue-100 transition"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-white text-blue-600 px-3 py-1 rounded font-semibold hover:bg-blue-100 transition"
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

        {/* ✅ Legal Routes */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
      </Routes>
    </div>
  )
}

export default App
