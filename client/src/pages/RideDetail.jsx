import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import RouteMap from '../components/RouteMap'
import BookingForm from '../components/BookingForm'

export default function RideDetail() {
  const { id } = useParams()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [userHasBooked, setUserHasBooked] = useState(false)

  const auth = getAuth()
  const currentUser = auth.currentUser

  const API_URL = `https://ride-along-api.onrender.com/api/rides/${id}`

  const fetchRide = async () => {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Ride not found')
      const data = await res.json()
      setRide(data)
      
      // Check if current user has booked this ride
      if (currentUser) {
        checkUserBooking(currentUser.uid)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkUserBooking = async (userId) => {
    try {
      const res = await fetch(`https://ride-along-api.onrender.com/api/bookings/user/${userId}`)
      if (res.ok) {
        const bookings = await res.json()
        const hasBooked = bookings.some(booking => 
          booking.rideId && booking.rideId._id === id
        )
        setUserHasBooked(hasBooked)
      }
    } catch (err) {
      console.error('Error checking user booking:', err)
    }
  }

  useEffect(() => {
    fetchRide()
  }, [id])

  const handleBookingSuccess = () => {
    // Refresh ride data to get updated seat count
    setLoading(true)
    fetchRide()
    setShowBooking(false)
    setUserHasBooked(true) // User has now booked
  }

  const isRideFullyBooked = ride?.seatsAvailable === 0
  const isOwnRide = currentUser && ride?.userId === currentUser.uid
  const isLoggedIn = !!currentUser
  const canSeeDetails = isOwnRide || userHasBooked

  const getBookingButtonText = () => {
    if (!isLoggedIn) return 'Login to Book'
    if (isOwnRide) return 'Your Ride'
    if (userHasBooked) return 'Already Booked'
    if (isRideFullyBooked) return 'All Seats Booked'
    return `Book Now (${ride?.seatsAvailable} seats left)`
  }

  const getBookingButtonStyle = () => {
    if (!isLoggedIn || isOwnRide || isRideFullyBooked || userHasBooked) {
      return 'bg-gray-600 cursor-not-allowed opacity-50'
    }
    return 'bg-blue-600 hover:bg-blue-700 transition-all'
  }

  if (loading) return <p className="text-center mt-10 text-blue-300 animate-pulse">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-400">Error: {error}</p>

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 relative">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">Ride Details</h1>

      <div className="bg-zinc-800 rounded-xl p-6 shadow-lg space-y-4 text-lg">
        <div><strong>From:</strong> {ride.from}</div>
        <div><strong>To:</strong> {ride.to}</div>
        {ride.via && ride.via.length > 0 && (
          <div><strong>Via:</strong> {ride.via.join(', ')}</div>
        )}
        <div><strong>Price:</strong> ₹{ride.price}</div>
        <div className="flex items-center gap-2">
          <strong>Seats Available:</strong> 
          <span className={`font-bold ${isRideFullyBooked ? 'text-red-400' : 'text-green-400'}`}>
            {ride.seatsAvailable}
          </span>
          {isRideFullyBooked && (
            <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
              FULLY BOOKED
            </span>
          )}
        </div>
        <div><strong>Departure Time:</strong> {new Date(ride.departureTime).toLocaleString()}</div>

        {/* Driver Details Section */}
        <div className="bg-zinc-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-300 mb-3">Driver Information</h3>
          
          {/* Driver Name - Always Visible */}
          <div className="mb-2">
            <strong>Driver Name:</strong> {ride.driverName}
          </div>
          
          {/* Contact Details - Conditional */}
          <div className="relative">
            <div className={`${!canSeeDetails ? 'filter blur-sm' : ''}`}>
              <div className="mb-2">
                <strong>Contact:</strong> {ride.driverContact}
              </div>
              <div>
                <strong>Vehicle Number:</strong> {ride.vehicleNumber}
              </div>
            </div>
            
            {!canSeeDetails && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-700 bg-opacity-80 rounded">
                <div className="text-center">
                  <div className="text-blue-400 font-semibold mb-1">🔒 Book to see details</div>
                  <div className="text-sm text-gray-400">Contact and vehicle details will be revealed after booking</div>
                </div>
              </div>
            )}
          </div>
          
          {canSeeDetails && (
            <div className="mt-3 p-2 bg-green-900 bg-opacity-30 rounded border border-green-500">
              <div className="text-green-400 text-sm">
                ✅ You can see all details because you have {isOwnRide ? 'posted this ride' : 'booked this ride'}
              </div>
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="mt-10 z-0 relative">
          <RouteMap from={ride.from} to={ride.to} via={ride.via} />
        </div>

        {/* Book Now Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (!isLoggedIn) {
                alert('Please login to book a ride')
                return
              }
              if (isOwnRide) {
                alert('You cannot book your own ride')
                return
              }
              if (userHasBooked) {
                alert('You have already booked this ride')
                return
              }
              if (isRideFullyBooked) {
                alert('This ride is fully booked')
                return
              }
              setShowBooking(true)
            }}
            disabled={!isLoggedIn || isOwnRide || isRideFullyBooked || userHasBooked}
            className={`${getBookingButtonStyle()} px-5 py-2 rounded-xl font-bold text-white`}
          >
            {getBookingButtonText()}
          </button>
          
          {/* Additional messaging */}
          {!isLoggedIn && (
            <p className="text-sm text-gray-400 mt-2">Please login to book this ride</p>
          )}
          {isOwnRide && (
            <p className="text-sm text-blue-400 mt-2">This is your posted ride</p>
          )}
          {userHasBooked && (
            <p className="text-sm text-green-400 mt-2">You have already booked this ride</p>
          )}
          {isRideFullyBooked && (
            <p className="text-sm text-red-400 mt-2">All seats have been booked for this ride</p>
          )}
        </div>

        <div className="text-sm text-zinc-400 mt-2">
          <strong>Posted:</strong> {new Date(ride.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-zinc-800 p-6 rounded-xl w-[90%] max-w-xl shadow-2xl relative">
            <button
              onClick={() => setShowBooking(false)}
              className="absolute top-2 right-3 text-red-400 hover:text-red-600 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Complete your Booking</h2>
            <BookingForm 
              rideId={id} 
              onBookingSuccess={handleBookingSuccess}
              currentSeatsAvailable={ride?.seatsAvailable}
              ridePrice={ride?.price}
            />
          </div>
        </div>
      )}
    </div>
  )
}
