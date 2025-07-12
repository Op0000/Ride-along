import { useEffect, useState } from "react"

export default function SearchRides() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://ride-along-api.onrender.com/api/rides?from=${from}&to=${to}`
      )
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Search Rides</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {results.length === 0 && !loading && (
        <p className="text-center text-gray-500">No rides found</p>
      )}

      <ul className="space-y-4">
        {results.map((ride) => (
          <li key={ride._id} className="border p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {ride.from} → {ride.to}
                </h3>
                <p className="text-sm text-gray-600">
                  Via: {ride.via.join(", ")}
                </p>
                <p className="text-sm">Driver: {ride.driverName}</p>
                <p className="text-sm">Price: ₹{ride.price}</p>
                <p className="text-sm">
                  Seats: {ride.seatsAvailable} | Time:{" "}
                  {new Date(ride.departureTime).toLocaleString()}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
