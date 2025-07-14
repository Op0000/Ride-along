import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'

export default function RideDetail() {
  const { id } = useParams()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState(null)

  const auth = getAuth()
  const user = auth.currentUser
  const API_BASE = 'https://ride-along-api.onrender.com'

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/rides/${id}`)
        if (!res.ok) throw new Error('Ride not found')
        const data = await res.json()
        setRide(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRide()
  }, [id, bookingSuccess]) // refetch after booking

  const handleBooking = async () => {
    if (!user || !ride || ride.seatsAvailable <= 0) return

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: ride._id,
          passengerId: user.uid,
          passengerName: user.displayName,
          passengerEmail: user.email
        })
      })

      if (!res.ok) throw new Error('Booking failed')

      setBookingSuccess(true)
      setBookingError(null)
    } catch (err) {
      setBookingError(err.message)
      setBookingSuccess(false)
    }
  }

  if (loading) return <p className="text-center mt-10 text-purple-300">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-400">Error: {error}</p>

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">Ride Details</h1>
      <div className="bg-zinc-800 rounded-xl p-6 shadow-lg space-y-4 text-lg">
        <div><strong>From:</strong> {ride.from}</div>
        <div><strong>To:</strong> {ride.to}</div>
        {ride.via?.length > 0 && <div><strong>Via:</strong> {ride.via.join(', ')}</div>}
        <div><strong>Price:</strong> ₹{ride.price}</div>
        <div><strong>Seats Available:</strong> {ride.seatsAvailable}</div>
        <div><strong>Departure Time:</strong> {new Date(ride.departureTime).toLocaleString()}</div>
        <div><strong>Driver Name:</strong> {ride.driverName}</div>
        <div><strong>Driver Contact:</strong> {ride.driverContact}</div>
        <div><strong>Vehicle Number:</strong> {ride.vehicleNumber}</div>
        <div className="text-sm text-zinc-400"><strong>Posted:</strong> {new Date(ride.createdAt).toLocaleString()}</div>

        {ride.seatsAvailable > 0 ? (
          <button
            onClick={handleBooking}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            Book Now
          </button>
        ) : (
          <div className="text-red-400 mt-4">No seats available</div>
        )}

        {bookingSuccess && (
          <p className="text-green-400 mt-2 text-center">✅ Ride Booked Successfully!</p>
        )}
        {bookingError && (
          <p className="text-red-400 mt-2 text-center">❌ {bookingError}</p>
        )}
      </div>
    </div>
  )
                                                                                  }
