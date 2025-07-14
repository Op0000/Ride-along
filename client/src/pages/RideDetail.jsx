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

  const auth = getAuth()
  const user = auth.currentUser
  const API = 'https://ride-along-api.onrender.com'

  // Fetch ride + booking status
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

    fetchRide()
    checkBooking()
  }, [id, user])

  const handleBooking = async () => {
    if (!user) return alert("Please login to book.")

    setBookingLoading(true)
    try {
      const res = await fetch(`${API}/api/bookings/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: id, userId: user.uid })
      })

      if (res.ok) {
        setUserHasBooked(true)
        setBookingSuccess(true)
        setRide((prev) => ({
          ...prev,
          seatsAvailable: prev.seatsAvailable - 1
        }))
        setTimeout(() => setBookingSuccess(false), 3000)
      } else {
        alert('Booking failed. Try again.')
      }
    } catch (err) {
      console.error('Booking error:', err)
      alert('Something went wrong.')
    } finally {
      setBookingLoading(false)
    }
  }

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

        {!userHasBooked && (
          <button
            onClick={handleBooking}
            disabled={bookingLoading || ride.seatsAvailable <= 0}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {bookingLoading ? "Booking..." : "Book Ride"}
          </button>
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
