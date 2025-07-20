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
import 'leaflet/dist/leaflet.css';

import Home from './pages/Home.jsx'
import PostRide from './pages/PostRide.jsx'
import SearchRides from './pages/SearchRide.jsx'
import RideDetail from './pages/RideDetail.jsx'
import Profile from './pages/Profile.jsx'

// ✅ Import your legal pages
import Terms from './pages/Terms.jsx'
import Privacy from './pages/PrivacyPolicy.jsx'
import Refund from './pages/Refund.jsx'

// ✅ BookingSuccess component
function BookingSuccess() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-xl shadow-2xl max-w-md mx-auto text-white border border-green-500 backdrop-blur-md text-center">
        <div className="text-6xl text-green-500 mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-400 mb-4">Booking Successful!</h1>
        <p className="text-gray-300 mb-6">
          Your ride has been booked successfully. You'll receive confirmation details via email.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/search')}
            className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
          >
            Search More Rides
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const auth = getAuth()
  const dropdownRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get the Firebase ID token and store it
          const token = await currentUser.getIdToken()
          localStorage.setItem('uid', currentUser.uid)
          localStorage.setItem('token', token)
        } catch (error) {
          console.error('Error getting ID token:', error)
        }
      } else {
        // Clear localStorage when user logs out
        localStorage.removeItem('uid')
        localStorage.removeItem('token')
      }
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
      const result = await signInWithPopup(auth, provider)
      
      // Get token and store it immediately after login
      const token = await result.user.getIdToken()
      localStorage.setItem('uid', result.user.uid)
      localStorage.setItem('token', token)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // Clear localStorage tokens
      localStorage.removeItem('uid')
      localStorage.removeItem('token')
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
        <Link to="/" className="flex items-center gap-2">
  <img src="/logo.png" alt="Ride Along Logo" className="h-10" />
  <span className="font-bold text-xl">Ride Along</span>
</Link>
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
                    💸 Refund Policy & Contact
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
        
        {/* ✅ Booking Success Route */}
        <Route path="/booking-success/:rideId" element={<BookingSuccess />} />

        {/* ✅ Legal Routes */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
      </Routes>
    </div>
  )
}

export default App
                               
