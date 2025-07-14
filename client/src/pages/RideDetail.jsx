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
  const [profile, setProfile] = useState({ name: '', age: '', gender: '', phone: '', email: '' })

  const auth = getAuth()
  const user = auth.currentUser
  const API = 'https://ride-along-api.onrender.com'

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`${API}/api/rides/${id}`)
        if (!res.ok) throw new Error('Ride not found')
        const data = await res.json()
        setRide(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const checkBooking = async () => {
      if (!user) return
      try {
        const res = await fetch(`${API}/api/bookings/user/${user.uid}`)
        const bookings = await res.json()
        const booked = bookings.some((b) => b.rideId === id)
        setUserHasBooked(booked)
      } catch (err) {
        console.error('Failed to check booking status:', err)
      }
    }

    const fetchProfile = async () => {
      if (!user) return
      try {
        const res = await fetch(`${API}/api/users/${user.uid}`)
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }

    fetchRide()
    checkBooking()
    fetchProfile()
  }, [id, user])

  const handleBooking = async () => {
  // Validate profile fields
  if (!user) {
    alert('Please login before continuing');
    return;
  }

  setBookingLoading(true);
    const payload = {
    rideId: id,
    userId: user.uid,
    userEmail: user.email || profile.email, // Fallback for email
    userName: profile.name,
    userPhone: profile.phone,
    userAge: profile.age,
    userGender: profile.gender,
  };
  console.log("Booking Payload:", payload);
    
  try {
    const res = await fetch(`${API}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rideId: id,
        userId: user.uid,
        userEmail: user.email,
        userName: profile.name,
        userPhone: profile.phone,
        userAge: profile.age,
        userGender: profile.gender,
      }),
    });

    const data = await res.json(); // Parse response

    if (res.ok) {
      // Success
      setUserHasBooked(true);
      setBookingSuccess(true);
      setShowForm(false);
      setRide((prev) => ({
        ...prev,
        seatsAvailable: prev.seatsAvailable - 1,
      }));
    } else {
      // Show backend error (e.g., "No seats left")
      alert(data.error || 'Booking failed. Please try again.');
    }
  } catch (err) {
    console.error('Booking error:', err);
    alert('Network error. Check console for details.');
  } finally {
    setBookingLoading(false);
  }
};

  if (loading) return <p className="text-center mt-10 text-purple-300">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-400">Error: {error}</p>

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">Ride Details</h1>

      <div className="bg-zinc-800 rounded-xl p-6 shadow-lg space-y-4 text-lg max-w-xl mx-auto">
        <div><strong>From:</strong> {ride.from}</div>
        <div><strong>To:</strong> {ride.to}</div>
        {ride.via?.length > 0 && (
          <div><strong>Via:</strong> {ride.via.join(', ')}</div>
        )}
        <div><strong>Price:</strong> ₹{ride.price}</div>
        <div><strong>Seats Available:</strong> {ride.seatsAvailable}</div>
        <div><strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}</div>
        <div><strong>Driver Name:</strong> {ride.driverName}</div>

        {userHasBooked ? (
          <>
            <div><strong>Driver Contact:</strong> {ride.driverContact}</div>
            <div><strong>Vehicle Number:</strong> {ride.vehicleNumber}</div>
          </>
        ) : (
          <div className="text-yellow-400 text-sm">
            🚫 Book this ride to unlock full driver contact and vehicle details.
          </div>
        )}

        {!userHasBooked && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            disabled={ride.seatsAvailable <= 0}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50"
          >
            Book Ride
          </button>
        )}

        {showForm && (
          <div className="mt-4 bg-zinc-700 p-4 rounded-lg space-y-3 animate-fade-in-down">
            {['name', 'age', 'gender', 'phone', 'email'].map((field) => (
              <div key={field}>
                <label className="block text-sm mb-1 capitalize">{field}</label>
                <input
                  name={field}
                  type={field === 'age' ? 'number' : 'text'}
                  value={profile[field] || ''}
                  onChange={(e) => setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  className="w-full px-3 py-2 rounded bg-zinc-600 border border-zinc-500 focus:outline-none focus:ring focus:ring-purple-500"
                />
              </div>
            ))}
            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
            >
              {bookingLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        {bookingSuccess && (
          <p className="text-green-400 text-center mt-2 animate-pulse">
            ✅ Booking Successful!
          </p>
        )}

        <div className="text-sm text-zinc-400 pt-2">
          <strong>Posted:</strong> {new Date(ride.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  )
}
