import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import VerificationForm from '../components/VerificationForm' // ✅ make sure this path matches your project

export default function Profile() {
  const auth = getAuth()
  const user = auth.currentUser
  const [details, setDetails] = useState({
    uid: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    driverVerification: null // ✅ added
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})
  
  // New state for rides and bookings
  const [bookedRides, setBookedRides] = useState([])
  const [postedRides, setPostedRides] = useState([])
  const [ridesLoading, setRidesLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(true)

  const API_BASE = 'https://ride-along-api.onrender.com/api/users'
  const RIDES_API = 'https://ride-along-api.onrender.com/api/rides'
  const BOOKINGS_API = 'https://ride-along-api.onrender.com/api/bookings'

  useEffect(() => {
    if (!user) return

    const fetchUser = async () => {  
      try {  
        const res = await fetch(`${API_BASE}/${user.uid}`)  
        if (res.ok) {  
          const data = await res.json()  
          setDetails({ ...data, uid: user.uid })  
        } else {  
          setDetails(prev => ({  
            ...prev,  
            uid: user.uid,  
            email: user.email || '',  
            name: user.displayName || ''  
          }))  
        }  
      } catch (err) {  
        console.error('Fetch failed:', err)  
      } finally {  
        setLoading(false)  
      }  
    }

    const fetchUserRides = async () => {
      try {
        const res = await fetch(`${RIDES_API}/user/${user.uid}`)
        if (res.ok) {
          const data = await res.json()
          setPostedRides(data)
        }
      } catch (err) {
        console.error('Failed to fetch user rides:', err)
      } finally {
        setRidesLoading(false)
      }
    }

    const fetchUserBookings = async () => {
      try {
        const res = await fetch(`${BOOKINGS_API}/user/${user.uid}`)
        if (res.ok) {
          const data = await res.json()
          setBookedRides(data)
        }
      } catch (err) {
        console.error('Failed to fetch user bookings:', err)
      } finally {
        setBookingsLoading(false)
      }
    }

    fetchUser()
    fetchUserRides()
    fetchUserBookings()
  }, [user])

  const validate = () => {
    const errs = {}
    if (!details.name) errs.name = 'Name is required'
    if (!details.age || details.age < 1) errs.age = 'Enter a valid age'
    if (!details.gender) errs.gender = 'Select your gender'
    if (!/^\d{10}$/.test(details.phone)) errs.phone = 'Enter a 10-digit phone number'
    if (!/^\S+@\S+\.\S+$/.test(details.email)) errs.email = 'Invalid email format'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSave = async () => {
    if (!validate()) return

    try {  
      const res = await fetch(`${API_BASE}/save`, {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify(details)  
      })  

      if (res.ok) {  
        setSaved(true)  
        setTimeout(() => setSaved(false), 2000)  
      }  
    } catch (err) {  
      console.error('Save failed:', err)  
    }
  }

  const handleCancelBooking = async (bookingId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login to cancel bookings')
      return
    }

    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      const res = await fetch(`${BOOKINGS_API}/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        setBookedRides(prev => prev.filter(booking => booking._id !== bookingId))
        alert('Booking cancelled successfully!')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to cancel booking')
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err)
      alert('Network error. Please try again.')
    }
  }

  const handleDeleteRide = async (rideId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login to delete rides')
      return
    }

    if (!confirm('Are you sure you want to delete this ride? This action cannot be undone.')) return

    try {
      const res = await fetch(`${RIDES_API}/${rideId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        setPostedRides(prev => prev.filter(ride => ride._id !== rideId))
        alert('Ride deleted successfully!')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete ride')
      }
    } catch (err) {
      console.error('Failed to delete ride:', err)
      alert('Network error. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDepartureTime = (departureTime) => {
    const date = new Date(departureTime)
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Your Profile</h1>

      {/* ✅ Added verification status */}
      <div className="max-w-2xl mx-auto mb-6 p-4 bg-zinc-800 rounded-lg shadow border border-zinc-700">
        {details.driverVerification?.isVerified ? (
          <p className="text-green-400 font-semibold">
            ✅ You are verified! You can post rides.
          </p>
        ) : (
          <>
            <p className="text-red-400 font-semibold mb-3">
              ⚠️ You are not verified. Please complete verification below.
            </p>
            <VerificationForm />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* Profile Details Column */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-2xl border border-zinc-700">
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Profile Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-purple-300">UID</label>
                <input
                  name="uid"
                  type="text"
                  value={details.uid}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 opacity-80 cursor-not-allowed text-sm"
                />
              </div>
              {['name', 'age', 'phone', 'email'].map((field) => (
                <div key={field}>
                  <label className="block text-sm mb-1 capitalize text-purple-300">{field}</label>
                  <input
                    name={field}
                    type={field === 'age' ? 'number' : 'text'}
                    value={details[field] || ''}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg bg-zinc-700 text-white border focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${
                      errors[field] ? 'border-red-500' : 'border-zinc-600'
                    }`}
                  />
                  {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm mb-1 text-purple-300">Gender</label>
                <select
                  name="gender"
                  value={details.gender}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg bg-zinc-700 text-white border appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${
                    errors.gender ? 'border-red-500' : 'border-zinc-600'
                  }`}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
              </div>
              <button
                onClick={handleSave}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-200 ease-in-out text-sm"
              >
                Save Changes
              </button>
              {saved && (
                <p className="text-green-400 text-center animate-pulse mt-2 text-sm">
                  ✅ Profile updated successfully
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Booked Rides Column */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-2xl border border-zinc-700">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">My Bookings ({bookedRides.length})</h2>
            {bookingsLoading ? (
              <div className="text-center text-gray-400">Loading bookings...</div>
            ) : bookedRides.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">📅</div>
                <p>No bookings yet</p>
                <p className="text-sm">Book your first ride to see it here!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bookedRides.map((booking) => (
                  <div key={booking._id} className="bg-zinc-700 p-3 rounded-lg border border-zinc-600">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        {booking.rideId ? (
                          <>
                            <div className="text-sm font-medium text-white truncate">
                              {booking.rideId.from} → {booking.rideId.to}
                            </div>
                            <div className="text-xs text-gray-400">
                              {booking.rideId.departureTime ? formatDepartureTime(booking.rideId.departureTime).date : 'N/A'} at {booking.rideId.departureTime ? formatDepartureTime(booking.rideId.departureTime).time : 'N/A'}
                            </div>
                            <div className="text-xs text-gray-400">
                              Seats: {booking.seatsBooked} | Booked: {formatDate(booking.bookedAt)}
                            </div>
                            <div className="text-xs text-green-400">
                              ₹{booking.rideId.price} total for {booking.seatsBooked} seat(s)
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-sm font-medium text-red-400">
                              Ride no longer available
                            </div>
                            <div className="text-xs text-gray-400">
                              Seats: {booking.seatsBooked} | Booked: {formatDate(booking.bookedAt)}
                            </div>
                            <div className="text-xs text-yellow-400">
                              Original ride may have been deleted
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs transition duration-200"
                    >
                      Cancel Booking
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Posted Rides Column */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-2xl border border-zinc-700">
            <h2 className="text-xl font-semibold text-green-300 mb-4">My Posted Rides ({postedRides.length})</h2>
            {ridesLoading ? (
              <div className="text-center text-gray-400">Loading rides...</div>
            ) : postedRides.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">🚗</div>
                <p>No rides posted yet</p>
                <p className="text-sm">Post your first ride to see it here!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {postedRides.map((ride) => (
                  <div key={ride._id} className="bg-zinc-700 p-3 rounded-lg border border-zinc-600">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {ride.from} → {ride.to}
                        </div>
                        <div className="text-xs text-gray-400">
                          {ride.departureTime ? formatDepartureTime(ride.departureTime).date : 'N/A'} at {ride.departureTime ? formatDepartureTime(ride.departureTime).time : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">
                          Seats Available: {ride.seatsAvailable}
                        </div>
                        <div className="text-xs text-green-400">
                          ₹{ride.price} per ride
                        </div>
                        {ride.via && ride.via.length > 0 && (
                          <div className="text-xs text-blue-400">
                            Via: {ride.via.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRide(ride._id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs transition duration-200"
                    >
                      Delete Ride
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
  }
