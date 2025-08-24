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
      {/* Hero / Intro */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 px-6 rounded-2xl shadow-lg mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to Ride Along 🚗</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Ride Along helps travelers across India connect and share rides. 
          Save money 💸, reduce pollution 🌍, and make your journeys smarter and safer.  
          Whether you’re posting a ride or booking one, Ride Along is here to put a smile on your face 🙂
        </p>
      </div>

      {/* Features Section */}
      <section className="py-10 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-purple-300">Why Ride Along?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white/10 p-6 rounded-xl shadow hover:bg-white/20 transition">
            <h3 className="text-xl font-bold mb-2">💸 Affordable</h3>
            <p>Split travel costs and make rides cheaper for everyone.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow hover:bg-white/20 transition">
            <h3 className="text-xl font-bold mb-2">🌍 Eco-Friendly</h3>
            <p>Fewer cars on the road means less pollution and traffic.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow hover:bg-white/20 transition">
            <h3 className="text-xl font-bold mb-2">🛡️ Safe & Verified</h3>
            <p>All drivers are verified for your safety and peace of mind.</p>
          </div>
        </div>
      </section>

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

      {/* Blog Teaser */}
<section className="py-10 px-6 text-center bg-zinc-800 rounded-xl shadow mb-10">
  <h2 className="text-2xl font-semibold mb-6 text-purple-300">From Our Blog</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
    <div className="bg-white/10 p-6 rounded-xl shadow hover:bg-white/20 transition">
      <h3 className="font-bold text-lg">🚗 The Ultimate Guide to Ride Sharing in India</h3>
      <p className="text-sm text-zinc-300 mt-2">
        Discover how ride sharing is revolutionizing commutes with savings up to 70% and reduced traffic.
      </p>
      <Link to="/blog/the-ultimate-guide-to-ride-sharing" className="text-purple-400 underline text-sm mt-3 inline-block">
        Read more
      </Link>
    </div>

    <div className="bg-white/10 p-6 rounded-xl shadow hover:bg-white/20 transition">
      <h3 className="font-bold text-lg">🚌 Delhi to Gurgaon Daily Commute</h3>
      <p className="text-sm text-zinc-300 mt-2">
        How shared rides cut commute costs by 75% while reducing stress on busy routes.
      </p>
      <Link to="/blog/delhi-to-gurgaon-daily-commute" className="text-purple-400 underline text-sm mt-3 inline-block">
        Read more
      </Link>
    </div>

    <div className="bg-white/10 p-6 rounded-xl shadow hover:bg-white/20 transition">
      <h3 className="font-bold text-lg">🛡️ Women’s Safety in Ride Sharing</h3>
      <p className="text-sm text-zinc-300 mt-2">
        A complete safety guide for women using ride sharing in Indian cities.
      </p>
      <Link to="/blog/womens-safety-in-ride-sharing" className="text-purple-400 underline text-sm mt-3 inline-block">
        Read more
      </Link>
    </div>
  </div>

  {/* Extra row for more articles */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
    <div className="bg-white/10 p-6 rounded-xl shadow hover:bg-white/20 transition">
      <h3 className="font-bold text-lg">🌧️ Monsoon Commuting in India</h3>
      <p className="text-sm text-zinc-300 mt-2">
        How smart ride sharing strategies save time and reduce stress during floods.
      </p>
      <Link to="/blog/monsoon-commuting-in-india" className="text-purple-400 underline text-sm mt-3 inline-block">
        Read more
      </Link>
    </div>
  </div>
</section>

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
