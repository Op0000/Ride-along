import { useState } from 'react'

export default function SearchRide({ onResults }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const handleSearch = async () => {
    try {
      const query = `?from=${from}&to=${to}`
      const res = await fetch(`https://ride-along-api.onrender.com/api/rides${query}`)
      const data = await res.json()
      onResults(data)
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="flex-1"
      />
      <input
        type="text"
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="flex-1"
      />
      <button onClick={handleSearch} className="self-start sm:self-auto">
        Search
      </button>
    </div>
  )
}
