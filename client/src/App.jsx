import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
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
import SOS from './pages/SOS.jsx'

// ✅ Import your legal pages
import Terms from './pages/Terms.jsx'
import Privacy from './pages/PrivacyPolicy.jsx'
import Refund from './pages/Refund.jsx'
import LiveLocation from './pages/LiveLocation.jsx'
import About from './pages/About.jsx'
import Support from './pages/Support.jsx'
import NotFound from './pages/NotFound.jsx'
import Footer from './components/Footer.jsx'

// ✅ BookingSuccess component
function BookingSuccess() {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [rideDetails, setRideDetails] = useState(null)
  const [userBooking, setUserBooking] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const userId = localStorage.getItem('uid')
        if (!userId || !rideId) {
          setError('Missing booking information')
          return
        }

        // Fetch ride details
        const rideRes = await fetch(`https://ride-along-api.onrender.com/api/rides/${rideId}`)
        if (!rideRes.ok) throw new Error('Ride not found')
        const ride = await rideRes.json()

        // Fetch user's bookings to get booking details
        const bookingsRes = await fetch(`https://ride-along-api.onrender.com/api/bookings/user/${userId}`)
        if (!bookingsRes.ok) throw new Error('Bookings not found')
        const bookings = await bookingsRes.json()

        // Find the booking for this ride
        const booking = bookings.find(b => b.rideId && b.rideId._id === rideId)
        
        setRideDetails(ride)
        setUserBooking(booking)
      } catch (err) {
        console.error('Error fetching booking details:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [rideId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="text-white text-xl animate-pulse">Loading booking details...</div>
      </div>
    )
  }

  if (error || !rideDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-zinc-800 p-8 rounded-xl shadow-2xl max-w-md mx-auto text-white border border-red-500 text-center">
          <div className="text-6xl text-red-500 mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Details</h1>
          <p className="text-gray-300 mb-6">{error || 'Unable to load booking details'}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  const departureDateTime = new Date(rideDetails.departureTime)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-xl shadow-2xl max-w-2xl mx-auto text-white border border-green-500 backdrop-blur-md">
        
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="text-6xl text-green-500 mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-400 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-300">
            Your ride has been booked successfully. Confirmation emails have been sent.
          </p>
        </div>

        {/* Booking Summary */}
        {userBooking && (
          <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg mb-6 border border-blue-500">
            <h2 className="text-xl font-semibold text-blue-300 mb-3">📋 Booking Summary</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><strong>Booking ID:</strong></div>
              <div className="font-mono text-green-400">{userBooking._id}</div>
              <div><strong>Seats Booked:</strong></div>
              <div>{userBooking.seatsBooked}</div>
              <div><strong>Total Cost:</strong></div>
              <div className="text-green-400 font-bold">₹{userBooking.seatsBooked * rideDetails.price}</div>
              <div><strong>Booked At:</strong></div>
              <div>{new Date(userBooking.bookedAt).toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Trip Details */}
        <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg mb-6 border border-purple-500">
          <h2 className="text-xl font-semibold text-purple-300 mb-3">🚗 Trip Details</h2>
          <div className="space-y-2">
            <div><strong>Route:</strong> {rideDetails.from} → {rideDetails.to}</div>
            {rideDetails.via && rideDetails.via.length > 0 && (
              <div><strong>Via:</strong> {rideDetails.via.join(', ')}</div>
            )}
            <div><strong>Date:</strong> {departureDateTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
            <div><strong>Time:</strong> {departureDateTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
            <div><strong>Price per seat:</strong> ₹{rideDetails.price}</div>
          </div>
        </div>

        {/* Driver Details - Now Fully Visible */}
        <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg mb-6 border border-green-500">
          <h2 className="text-xl font-semibold text-green-300 mb-3">👨‍🚗 Driver Details</h2>
          <div className="space-y-2">
            <div><strong>Name:</strong> {rideDetails.driverName}</div>
            <div><strong>Contact:</strong> 
              <span className="ml-2 bg-green-700 px-2 py-1 rounded text-green-200 font-mono">
                {rideDetails.driverContact}
              </span>
            </div>
            <div><strong>Vehicle:</strong> 
              <span className="ml-2 bg-green-700 px-2 py-1 rounded text-green-200 font-mono">
                {rideDetails.vehicleNumber}
              </span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-green-800 bg-opacity-50 rounded border-l-4 border-green-400">
            <div className="text-green-200 text-sm">
              💡 <strong>Contact the driver:</strong> Reach out before departure to confirm pickup location and any last-minute details.
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-900 bg-opacity-30 p-4 rounded-lg mb-6 border border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-300 mb-3">⚠️ Important Notes</h2>
          <ul className="text-sm space-y-1 list-disc list-inside text-yellow-100">
            <li>Arrive at pickup location 10 minutes early</li>
            <li>Keep your phone accessible for driver communication</li>
            <li>You can cancel your booking from your profile page</li>
            <li>Contact support if you face any issues</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition-colors font-semibold"
          >
            View My Bookings
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/search')}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
            >
              Search More Rides
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
      {/* Trustpilot Widget */}
<div className="mt-6">
  <div className="trustpilot-widget"
    data-locale="en-US"
    data-template-id="56278e9abfbbba0bdcd568bc"
    data-businessunit-id="6884f1eebf3047186ff310e4"
    data-style-height="52px"
    data-style-width="100%">
    <a href="https://www.trustpilot.com/review/ride-along.xyz" target="_blank" rel="noopener">Trustpilot</a>
  </div>
</div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const auth = getAuth()
  const dropdownRef = useRef()
  const mobileMenuRef = useRef()
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false)
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
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg relative">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-white">
              <img src="/logo.png" alt="Ride Along Logo" className="h-10" />
              <span className="font-bold text-xl">Ride Along</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/post" className="text-white hover:text-blue-200 transition font-medium">
                📝 Post Ride
              </Link>
              <Link to="/search" className="text-white hover:text-blue-200 transition font-medium">
                🔍 Search
              </Link>
              <Link to="/support" className="text-white hover:text-blue-200 transition font-medium">
                🛟 Support
              </Link>
              <Link 
                to="/sos" 
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition transform hover:scale-105 shadow-lg"
              >
                🆘 SOS
              </Link>
              
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition shadow-md"
                  >
                    {user.displayName?.split(' ')[0] || 'User'} ⌄
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white text-blue-700 rounded-xl shadow-xl z-50 border border-blue-100">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 hover:bg-blue-50 transition border-b border-blue-100"
                      >
                        👤 Profile & Bookings
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 hover:bg-blue-50 transition border-b border-blue-100"
                      >
                        ℹ️ About Us
                      </Link>
                      <Link
                        to="/support"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 hover:bg-blue-50 transition border-b border-blue-100"
                      >
                        🛟 Support Center
                      </Link>
                      <div className="px-4 py-2 border-b border-blue-100">
                        <p className="text-xs text-blue-500 font-medium mb-2">Legal & Policies</p>
                        <div className="grid grid-cols-1 gap-1">
                          <Link
                            to="/terms"
                            onClick={() => setDropdownOpen(false)}
                            className="text-sm hover:text-blue-800 transition"
                          >
                            📜 Terms & Conditions
                          </Link>
                          <Link
                            to="/privacy"
                            onClick={() => setDropdownOpen(false)}
                            className="text-sm hover:text-blue-800 transition"
                          >
                            🔒 Privacy Policy
                          </Link>
                          <Link
                            to="/refund"
                            onClick={() => setDropdownOpen(false)}
                            className="text-sm hover:text-blue-800 transition"
                          >
                            💸 Refund Policy
                          </Link>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-700 transition rounded-b-xl"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md"
                >
                  🔐 Login with Google
                </button>
              )}
            </div>

            {/* Mobile Navigation Toggle & SOS */}
            <div className="lg:hidden flex items-center gap-3">
              <Link 
                to="/sos" 
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white font-semibold transition text-sm"
              >
                🆘 SOS
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-blue-200 transition p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div ref={mobileMenuRef} className="lg:hidden mt-4 bg-blue-700 rounded-xl shadow-xl border border-blue-500">
              <div className="py-2">
                <Link
                  to="/post"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white hover:bg-blue-600 transition border-b border-blue-600"
                >
                  📝 Post a Ride
                </Link>
                <Link
                  to="/search"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white hover:bg-blue-600 transition border-b border-blue-600"
                >
                  🔍 Search Rides
                </Link>
                <Link
                  to="/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white hover:bg-blue-600 transition border-b border-blue-600"
                >
                  🛟 Support Center
                </Link>

                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-white hover:bg-blue-600 transition border-b border-blue-600"
                    >
                      👤 Profile & Bookings
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-white hover:bg-blue-600 transition border-b border-blue-600"
                    >
                      ℹ️ About Us
                    </Link>
                    
                    <div className="px-4 py-2 border-b border-blue-600">
                      <p className="text-xs text-blue-200 font-medium mb-2">Legal & Policies</p>
                      <div className="space-y-1">
                        <Link
                          to="/terms"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-sm text-blue-200 hover:text-white transition"
                        >
                          📜 Terms & Conditions
                        </Link>
                        <Link
                          to="/privacy"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-sm text-blue-200 hover:text-white transition"
                        >
                          🔒 Privacy Policy
                        </Link>
                        <Link
                          to="/refund"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-sm text-blue-200 hover:text-white transition"
                        >
                          💸 Refund Policy
                        </Link>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 text-red-200 hover:bg-red-600 hover:text-white transition"
                    >
                      🚪 Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogin()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-white hover:bg-blue-600 transition"
                  >
                    🔐 Login with Google
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<PostRide />} />
        <Route path="/search" element={<SearchRides />} />
        <Route path="/ride/:id" element={<RideDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sos" element={<SOS />} />
        
        {/* ✅ Booking Success Route */}
        <Route path="/booking-success/:rideId" element={<BookingSuccess />} />

        {/* ✅ Live Location Route */}
        <Route path="/live-location/:sessionId" element={<LiveLocation />} />

        {/* ✅ Legal Routes */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        
        {/* ✅ 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Footer Component */}
      <Footer />
    </div>
  )
}

export default App
                               
