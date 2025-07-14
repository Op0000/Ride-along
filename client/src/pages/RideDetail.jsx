import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'

export default function RideDetail() {
  const { id } = useParams()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userHasBooked, setUserHasBooked] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [profile, setProfile] = useState({ 
    name: '', 
    age: '', 
    gender: '', 
    phone: '', 
    email: '' 
  })

  const auth = getAuth()
  const user = auth.currentUser
  const API = 'https://ride-along-api.onrender.com'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ride data
        const rideRes = await fetch(`${API}/api/rides/${id}`)
        if (!rideRes.ok) throw new Error('Ride not found')
        const rideData = await rideRes.json()
        setRide(rideData)

        // Fetch user data if logged in
        if (user) {
          const [bookingsRes, profileRes] = await Promise.all([
            fetch(`${API}/api/bookings/user/${user.uid}`),
            fetch(`${API}/api/users/${user.uid}`)
          ])
          
          const bookings = await bookingsRes.json()
          setUserHasBooked(bookings.some(b => b.rideId === id))
          
          if (profileRes.ok) {
            const profileData = await profileRes.json()
            setProfile({
              ...profileData,
              email: profileData.email || user.email || ''
            })
          }
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user])

  const handleBooking = async () => {
    // Validate all required fields
    if (!user) {
      alert('Please login to book a ride')
      return
    }

    const requiredFields = ['name', 'phone', 'age']
    const missingFields = requiredFields.filter(field => !profile[field])
    
    if (missingFields.length > 0) {
      alert(`Please fill: ${missingFields.join(', ')}`)
      return
    }

    setBookingLoading(true)
    
    try {
      const bookingData = {
        rideId: id,
        userId: user.uid,
        userEmail: user.email || profile.email,
        userName: profile.name,
        userPhone: profile.phone,
        userAge: profile.age,
        userGender: profile.gender,
        _debug: new Date().toISOString()
      }

      console.log('Submitting booking:', bookingData)

      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify(bookingData)
      })

      const data = await res.json()
      console.log('Booking response:', data)

      if (!res.ok) {
        throw new Error(data.error || 'Booking failed')
      }

      // Update UI on success
      setUserHasBooked(true)
      setBookingSuccess(true)
      setShowForm(false)
      setRide(prev => ({
        ...prev,
        seatsAvailable: prev.seatsAvailable - 1
      }))
      
    } catch (err) {
      console.error('Booking error:', err)
      alert(`Booking failed: ${err.message}`)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <p className="text-center mt-10 text-purple-300">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-400">Error: {error}</p>

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">Ride Details</h1>

      {ride && (
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg space-y-4 text-lg max-w-xl mx-auto">
          {/* Ride details remain the same */}
          {/* ... */}

          {showForm ? (
            <div className="mt-4 bg-zinc-700 p-4 rounded-lg space-y-3">
              {['name', 'age', 'gender', 'phone', 'email'].map((field) => (
                <div key={field}>
                  <label className="block text-sm mb-1 capitalize">
                    {field} {['name', 'age', 'phone'].includes(field) && '*'}
                  </label>
                  <input
                    name={field}
                    type={field === 'age' ? 'number' : 'text'}
                    value={profile[field] || ''}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      [field]: e.target.value 
                    }))}
                    className="w-full px-3 py-2 rounded bg-zinc-600 border border-zinc-500 focus:outline-none focus:ring focus:ring-purple-500"
                    required={['name', 'age', 'phone'].includes(field)}
                  />
                </div>
              ))}
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold disabled:opacity-50"
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          ) : (
            !userHasBooked && ride.seatsAvailable > 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition"
              >
                Book Ride
              </button>
            )
          )}

          {bookingSuccess && (
            <p className="text-green-400 text-center mt-2 animate-pulse">
              ✅ Booking Successful!
            </p>
          )}
        </div>
      )}
    </div>
  )
}
