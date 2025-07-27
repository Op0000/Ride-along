import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SearchRide from './SearchRide.jsx'
import PostRide from './PostRide.jsx'

export default function Home() {
  const [rides, setRides] = useState([])
  const [showPost, setShowPost] = useState(false)

  const API_URL = 'https://ride-along-api.onrender.com/api/rides'

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
    <motion.div
      className="min-h-screen bg-zinc-900 text-white px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-400 tracking-tight">
          Ride Along 🚗
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">Post your route or join one on the way</p>
      </div>

      {/* Search Section */}
      <motion.div
        className="bg-zinc-800 p-4 rounded-xl shadow-lg mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">Search Rides</h2>
        <SearchRide onResults={setRides} />
      </motion.div>

      {/* Post Section */}
      <motion.div
        className="bg-zinc-800 p-4 rounded-xl shadow-lg mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-purple-300">Offer a Ride</h2>
          <button
            onClick={() => setShowPost(!showPost)}
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-2 rounded-lg"
          >
            {showPost ? 'Close Form' : 'Post a Ride'}
          </button>
        </div>
        <AnimatePresence>
          {showPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PostRide onPost={fetchRides} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Ride List */}
      <motion.div
        className="bg-zinc-800 p-4 rounded-xl shadow-lg mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">Recent Rides</h2>
        {rides.length === 0 ? (
          <p className="text-zinc-400">No rides found.</p>
        ) : (
          <ul className="space-y-4">
            {rides.map((ride) => (
              <motion.li
                key={ride._id}
                className="bg-zinc-700 rounded-lg p-4 border border-zinc-600 hover:bg-zinc-600 transition"
                whileHover={{ scale: 1.02 }}
              >
                <Link to={`/ride/${ride._id}`} className="block space-y-1">
                  <div><span className="font-semibold text-white">From:</span> {ride.from}</div>
                  <div><span className="font-semibold text-white">To:</span> {ride.to}</div>
                  {ride.via && ride.via.length > 0 && (
                    <div><span className="font-semibold text-white">Via:</span> {ride.via.join(', ')}</div>
                  )}
                  <div><span className="font-semibold text-white">Driver:</span> {ride.driverName}</div>
                  <div><span className="font-semibold text-white">Vehicle:</span> {ride.vehicleNumber}</div>
                  <div><span className="font-semibold text-white">Price:</span> ₹{ride.price}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Seats:</span> 
                    <span className={`font-bold ${ride.seatsAvailable === 0 ? 'text-red-400' : ride.seatsAvailable <= 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {ride.seatsAvailable}
                    </span>
                    {ride.seatsAvailable === 0 && (
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        FULLY BOOKED
                      </span>
                    )}
                    {ride.seatsAvailable > 0 && ride.seatsAvailable <= 2 && (
                      <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">
                        FILLING FAST
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-2">
                    <span className="font-semibold">Departure:</span> {new Date(ride.departureTime).toLocaleDateString()} at {new Date(ride.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Trustpilot Widget */}
      <div className="mt-10 flex justify-center">
        <div className="trustpilot-widget"
          data-locale="en-US"
          data-template-id="56278e9abfbbba0bdcd568bc"
          data-businessunit-id="6884f1eebf3047186ff310e4"
          data-style-height="52px"
          data-style-width="100%">
          <a href="https://www.trustpilot.com/review/ride-along.xyz"
             target="_blank" 
             rel="noopener noreferrer"
             className="text-green-400 underline text-center block mt-4">
            Leave a Review on Trustpilot
          </a>
        </div>
      </div>
    </motion.div>
  )
          }
