import { useState } from 'react'

export default function PostRide({ onPost }) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    via: '',
    price: '',
    seats: '',
    driverName: '',
    driverContact: '',
    vehicleNumber: '',
    departureTime: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('https://ride-along-api.onrender.com/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const result = await res.json()
        console.log('Ride posted:', result)
        onPost()
        setFormData({
          from: '',
          to: '',
          via: '',
          price: '',
          seats: '',
          driverName: '',
          driverContact: '',
          vehicleNumber: '',
          departureTime: ''
        })
      } else {
        console.error('Failed to post ride')
      }
    } catch (err) {
      console.error('Error posting ride:', err)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <input
        type="text"
        name="from"
        value={formData.from}
        onChange={handleChange}
        placeholder="From"
        required
        className="px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
      />
      <input
        type="text"
        name="to"
        value={formData.to}
        onChange={handleChange}
        placeholder="To"
        required
        className="px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
      />
      <input
        type="text"
        name="via"
        value={formData.via}
        onChange={handleChange}
        placeholder="Via (optional)"
        className="px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price (₹)"
        required
        className="px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
      />
      <input
        type="number"
        name="seats"
        value={formData.seats}
        onChange={handleChange}
        placeholder="Seats"
        required
        className="px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
      />

      {/* New Fields */}
      <input
        type="text"
        name="driverName"
        value={formData.driverName}
        onChange={handleChange}
        placeholder="Driver's Name"
        required
        className="px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
      />
      <input
        type="text"
        name="driverContact"
        value={formData.driverContact}
        onChange={handleChange}
        placeholder="Driver Contact"
        required
        className="px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
      />
      <input
        type="text"
        name="vehicleNumber"
        value={formData.vehicleNumber}
        onChange={handleChange}
        placeholder="Vehicle Number"
        required
        className="px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
      />
      <input
        type="datetime-local"
        name="departureTime"
        value={formData.departureTime}
        onChange={handleChange}
        required
        className="px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        {loading ? 'Posting...' : 'Post Ride'}
      </button>
    </form>
  )
}
