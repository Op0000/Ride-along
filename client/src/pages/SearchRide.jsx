import { useState } from 'react'

export default function SearchRide({ onResults }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const query = new URLSearchParams()
      if (from) query.append('from', from)
      if (to) query.append('to', to)

      const res = await fetch(`https://ride-along-api.onrender.com/api/rides?${query}`)
      const data = await res.json()
      onResults(data)
    } catch (err) {
      console.error('❌ Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
      <div>
        <label className="block text-sm text-zinc-400 mb-1">From</label>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="e.g. Bareilly or Hapur"
          className="w-full px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
        />
      </div>
      <div>
        <label className="block text-sm text-zinc-400 mb-1">To</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="e.g. Noida or Delhi"
          className="w-full px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
