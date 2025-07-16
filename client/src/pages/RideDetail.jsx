import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import RouteMap from '../components/RouteMap'
import ReCAPTCHA from 'react-google-recaptcha'

export default function RideDetail() {
  const { id } = useParams()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showCaptcha, setShowCaptcha] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)

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

  if (loading) return <p className="text-center mt-10 text-purple-300">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-400">Error: {error}</p>

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 rounded-xl">
              {verifying ? (
                <div className="text-blue-300 text-lg animate-pulse">Verifying...</div>
              ) : showCaptcha ? (
                <div className="bg-white p-4 rounded shadow text-black z-10">
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
        <div className="mt-8 z-0">
          <RouteMap from={ride.from} to={ride.to} via={ride.via} />
        </div>

        <div className="text-sm text-zinc-400">
          <strong>Posted:</strong> {new Date(ride.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  )
          }
