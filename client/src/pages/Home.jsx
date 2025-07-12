import { useEffect, useState } from 'react'
import SearchRide from './SearchRide.jsx'
import PostRide from './PostRide.jsx'

export default function Home() {
  const [rides, setRides] = useState([])

  const API_URL = 'https://ride-along-api.onrender.com/api/rides' // Replace with actual

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
    <div className="min-h-screen bg-zinc-900 text-white px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-400 tracking-tight">
          Ride Along 🚗
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">Post your route or join one on the way</p>
      </div>

      {/* Search Section */}
      <div className="bg-zinc-800 p-4 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">Search Rides</h2>
        <SearchRide onResults={setRides} />
      </div>

      {/* Post Section */}
      <div className="bg-zinc-800 p-4 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">Offer a Ride</h2>
        <PostRide onPost={fetchRides} />
      </div>

      {/* Ride List */}
      <div className="bg-zinc-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">Recent Rides</h2>
        {rides.length === 0 ? (
          <p className="text-zinc-400">No rides found.</p>
        ) : (
          <ul className="space-y-4">
            {rides.map((ride) => (
              <li
                key={ride._id}
                className="bg-zinc-700 rounded-lg p-4 border border-zinc-600"
              >
                <div><span className="font-semibold text-white">From:</span> {ride.from}</div>
                <div><span className="font-semibold text-white">To:</span> {ride.to}</div>
                {ride.via && <div><span className="font-semibold text-white">Via:</span> {ride.via}</div>}
                <div><span className="font-semibold text-white">Price:</span> ₹{ride.price}</div>
                <div><span className="font-semibold text-white">Seats:</span> {ride.seats}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
