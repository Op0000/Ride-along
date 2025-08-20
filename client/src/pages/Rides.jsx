
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AutocompleteInput from '../components/AutocompleteInput'

export default function Rides() {
  const [rides, setRides] = useState([])
  const [filteredRides, setFilteredRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState({
    from: '',
    to: '',
    date: '',
    minPrice: '',
    maxPrice: '',
    minSeats: ''
  })
  const [sortBy, setSortBy] = useState('departureTime')
  const [sortOrder, setSortOrder] = useState('asc')

  useEffect(() => {
    fetchRides()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [rides, searchFilters, sortBy, sortOrder])

  const fetchRides = async () => {
    try {
      const res = await fetch('https://ride-along-api.onrender.com/api/rides')
      const data = await res.json()
      setRides(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching rides:', error)
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...rides]

    // Apply search filters
    if (searchFilters.from) {
      filtered = filtered.filter(ride => 
        ride.from.toLowerCase().includes(searchFilters.from.toLowerCase())
      )
    }

    if (searchFilters.to) {
      filtered = filtered.filter(ride => 
        ride.to.toLowerCase().includes(searchFilters.to.toLowerCase())
      )
    }

    if (searchFilters.date) {
      const filterDate = new Date(searchFilters.date).toDateString()
      filtered = filtered.filter(ride => 
        new Date(ride.departureTime).toDateString() === filterDate
      )
    }

    if (searchFilters.minPrice) {
      filtered = filtered.filter(ride => ride.price >= parseInt(searchFilters.minPrice))
    }

    if (searchFilters.maxPrice) {
      filtered = filtered.filter(ride => ride.price <= parseInt(searchFilters.maxPrice))
    }

    if (searchFilters.minSeats) {
      filtered = filtered.filter(ride => ride.seatsAvailable >= parseInt(searchFilters.minSeats))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'departureTime':
          aValue = new Date(a.departureTime)
          bValue = new Date(b.departureTime)
          break
        case 'seatsAvailable':
          aValue = a.seatsAvailable
          bValue = b.seatsAvailable
          break
        default:
          aValue = new Date(a.departureTime)
          bValue = new Date(b.departureTime)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredRides(filtered)
  }

  const handleFilterChange = (name, value) => {
    setSearchFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleInputChange = (e) => {
    setSearchFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const clearFilters = () => {
    setSearchFilters({
      from: '',
      to: '',
      date: '',
      minPrice: '',
      maxPrice: '',
      minSeats: ''
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading rides...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
          Find Your Ride 🚗
        </h1>

        {/* Search and Filters */}
        <div className="bg-zinc-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Search & Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <AutocompleteInput
              name="from"
              placeholder="From"
              value={searchFilters.from}
              onChange={handleFilterChange}
            />
            <AutocompleteInput
              name="to"
              placeholder="To"
              value={searchFilters.to}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="date"
              value={searchFilters.date}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="number"
              name="minPrice"
              value={searchFilters.minPrice}
              onChange={handleInputChange}
              placeholder="Min Price (₹)"
              className="input"
            />
            <input
              type="number"
              name="maxPrice"
              value={searchFilters.maxPrice}
              onChange={handleInputChange}
              placeholder="Max Price (₹)"
              className="input"
            />
            <input
              type="number"
              name="minSeats"
              value={searchFilters.minSeats}
              onChange={handleInputChange}
              placeholder="Min Seats"
              className="input"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-purple-300">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-700 text-white px-3 py-1 rounded"
              >
                <option value="departureTime">Departure Time</option>
                <option value="price">Price</option>
                <option value="seatsAvailable">Available Seats</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-purple-300">Order:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-zinc-700 text-white px-3 py-1 rounded"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-zinc-400">
            Showing {filteredRides.length} of {rides.length} rides
          </p>
        </div>

        {/* Rides List */}
        <div className="space-y-4">
          {filteredRides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-zinc-400">No rides found matching your criteria</p>
              <button
                onClick={clearFilters}
                className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredRides.map((ride) => {
              const dateTime = formatDateTime(ride.departureTime)
              const isExpired = new Date(ride.departureTime) < new Date()

              return (
                <motion.div
                  key={ride._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-zinc-800 p-6 rounded-xl border-l-4 ${
                    isExpired ? 'border-red-500 opacity-60' : 'border-purple-500'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-semibold text-purple-300">
                          {ride.from} → {ride.to}
                        </h3>
                        {isExpired && (
                          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                            EXPIRED
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-zinc-400">Date:</span>
                          <div className="font-medium">{dateTime.date}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Time:</span>
                          <div className="font-medium">{dateTime.time}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Price:</span>
                          <div className="font-medium text-green-400">₹{ride.price}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Seats:</span>
                          <div className="font-medium">{ride.seatsAvailable} available</div>
                        </div>
                      </div>

                      {ride.car && (
                        <div className="mt-2">
                          <span className="text-zinc-400">Vehicle:</span>
                          <span className="ml-2 font-medium">{ride.car}</span>
                        </div>
                      )}

                      {ride.via && ride.via.length > 0 && (
                        <div className="mt-2">
                          <span className="text-zinc-400">Via:</span>
                          <span className="ml-2">{ride.via.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/ride/${ride._id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-center transition-colors"
                      >
                        View Details
                      </Link>
                      {ride.seatsAvailable === 0 && (
                        <span className="bg-red-600 text-white px-4 py-1 rounded text-center text-sm">
                          Fully Booked
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>
    </div>
  )
}
