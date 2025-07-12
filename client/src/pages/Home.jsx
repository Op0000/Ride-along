import { useEffect, useState } from 'react'
import SearchRide from './SearchRide.jsx'
import PostRide from './PostRide'

export default function Home() {
  const [rides, setRides] = useState([])

  const API_URL = 'https://ride-along-api.onrender.com/api/rides' // replace with actual backend URL

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setRides(data)
    } catch (err) {
      console.error('Error fetching rides:', err)
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="bg-blue-100 rounded-xl p-6 text-center mb-6 shadow-md">
        <h1 className="text-4xl font-bold text-blue-700">Ride Along 🚗</h1>
        <p className="text-gray-600 mt-2">Post your route or join one on the way</p>
      </div>

      {/* Search Ride */}
      <div className="mb-6">
        <SearchRide onResults={setRides} />
      </div>

      {/* Post Ride */}
      <div className="mb-6">
        <PostRide onPost={fetchRides} />
      </div>

      {/* Ride List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Recent Rides</h2>
        {rides.length === 0 ? (
          <p className="text-gray-500">No rides found.</p>
        ) : (
          <ul className="space-y-4">
            {rides.map((ride) => (
              <li key={ride._id} className="border rounded p-3">
                <div><strong>From:</strong> {ride.from}</div>
                <div><strong>To:</strong> {ride.to}</div>
                {ride.via && <div><strong>Via:</strong> {ride.via}</div>}
                <div><strong>Price:</strong> ₹{ride.price}</div>
                <div><strong>Seats:</strong> {ride.seats}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
