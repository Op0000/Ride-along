import { useState } from 'react'

export default function PostRide({ onPost }) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    via: '',
    price: '',
    seatsAvailable: '',
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

  const payload = {
    ...formData,
    price: Number(formData.price),
    seatsAvailable: Number(formData.seatsAvailable),
    via: formData.via ? formData.via.split(',').map(item => item.trim()) : []
  }

  console.log('🚀 Submitting payload:', payload)

  try {
    const res = await fetch('https://ride-along-api.onrender.com/api/rides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    console.log('📡 Fetch complete, status:', res.status)

    const result = await res.json()
    console.log('📦 Response JSON:', result)

    if (res.ok) {
      alert('✅ Ride posted successfully!')
      onPost?.()
      setFormData({
        from: '',
        to: '',
        via: '',
        price: '',
        seatsAvailable: '',
        driverName: '',
        driverContact: '',
        vehicleNumber: '',
        departureTime: ''
      })
    } else {
      alert(`❌ Failed to post ride: ${result.error || 'Unknown error'}`)
    }
  } catch (err) {
    console.error('❌ Caught error:', err)
    alert(`🚨 Error occurred: ${err.message}`)
  }

  setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <input type="text" name="from" value={formData.from} onChange={handleChange} placeholder="From" required className="input" />
      <input type="text" name="to" value={formData.to} onChange={handleChange} placeholder="To" required className="input" />
      <input type="text" name="via" value={formData.via} onChange={handleChange} placeholder="Via (comma-separated)" className="input" />
      <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (₹)" required className="input" />
      <input type="number" name="seatsAvailable" value={formData.seatsAvailable} onChange={handleChange} placeholder="Seats Available" required className="input" />
      <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} placeholder="Driver's Name" required className="input" />
      <input type="text" name="driverContact" value={formData.driverContact} onChange={handleChange} placeholder="Driver Contact" required className="input" />
      <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="Vehicle Number" required className="input" />
      <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} required className="input" />

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
