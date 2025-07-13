import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

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
      <div className="bg-zinc-800 rounded-xl p-6 shadow-lg space-y-3">
        <div><strong>From:</strong> {ride.from}</div>
        <div><strong>To:</strong> {ride.to}</div>
        {ride.via && <div><strong>Via:</strong> {ride.via}</div>}
        <div><strong>Price:</strong> ₹{ride.price}</div>
        <div><strong>Seats:</strong> {ride.seats}</div>
        <div><strong>Posted:</strong> {new Date(ride.createdAt).toLocaleString()}</div>
      </div>
    </div>
  )
}
