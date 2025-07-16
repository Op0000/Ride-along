import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import RouteMap from '../components/RouteMap' // Adjust path as needed

export default function RideDetail() {
  const { id } = useParams()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        <div><strong>Driver Name:</strong> {ride.driverName}</div>
        <div><strong>Driver Contact:</strong> {ride.driverContact}</div>
        <div><strong>Vehicle Number:</strong> {ride.vehicleNumber}</div>
        <RouteMap from={ride.from} to={ride.to} via={ride.via} />
        <div className="text-sm text-zinc-400"><strong>Posted:</strong> {new Date(ride.createdAt).toLocaleString()}</div>
      </div>
    </div>
  )
}
