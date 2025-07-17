import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import RouteMap from '../components/RouteMap'
import ReCAPTCHA from 'react-google-recaptcha'
import BookingForm from '../components/BookingForm'

export default function RideDetail() {
  const { id } = useParams()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showCaptcha, setShowCaptcha] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const [showBooking, setShowBooking] = useState(false)

  const API_URL = `https://ride-along-api.onrender.com/api/rides/${id}`

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(API_URL)
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
  }, [id])

  const handleCaptcha = (token) => {
    if (token) {
      setVerifying(true)
      setTimeout(() => {
        setVerified(true)
        setShowCaptcha(false)
        setVerifying(false)
      }, 1000)
    }
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
        <div><strong>Seats Available:</strong> {ride.seatsAvailable}</div>
        <div><strong>Departure Time:</strong> {new Date(ride.departureTime).toLocaleString()}</div>

        {/* Sensitive Section */}
        <div className="relative">
          <div className={`transition-all duration-300 ${!verified ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
            <div><strong>Driver Name:</strong> {ride.driverName}</div>
            <div><strong>Driver Contact:</strong> {ride.driverContact}</div>
            <div><strong>Vehicle Number:</strong> {ride.vehicleNumber}</div>
          </div>

          {!verified && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 rounded-xl z-10">
              {verifying ? (
                <div className="text-blue-300 text-lg animate-pulse">Verifying...</div>
              ) : showCaptcha ? (
                <div className="bg-white p-4 rounded shadow text-black">
                  <ReCAPTCHA
                    sitekey="6LdlI4UrAAAAAFDXPMbQCK7lo79hzsr1AkB_Acyb"
                    onChange={handleCaptcha}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowCaptcha(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Show Full Details
                </button>
              )}
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
            onClick={() => setShowBooking(true)}
            className="bg-blue-600 hover:bg-blue-700 transition-all px-5 py-2 rounded-xl font-bold text-white"
          >
            Book Now
          </button>
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
            <BookingForm rideId={id} />
          </div>
        </div>
      )}
    </div>
  )
          }
