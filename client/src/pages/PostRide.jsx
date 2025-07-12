import { useState } from 'react'

export default function PostRide({ onPost }) {
  const [form, setForm] = useState({
    driver: '',
    from: '',
    to: '',
    via: '',
    price: '',
    seats: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch('https://your-backend.onrender.com/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        onPost()
        setForm({
          driver: '',
          from: '',
          to: '',
          via: '',
          price: '',
          seats: '',
        })
      }
    } catch (err) {
      console.error('Post failed:', err)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input name="driver" placeholder="Driver Name" value={form.driver} onChange={handleChange} />
      <input name="from" placeholder="From" value={form.from} onChange={handleChange} />
      <input name="to" placeholder="To" value={form.to} onChange={handleChange} />
      <input name="via" placeholder="Via (comma separated)" value={form.via} onChange={handleChange} />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <input name="seats" placeholder="Seats Available" value={form.seats} onChange={handleChange} />
      <button onClick={handleSubmit} className="sm:col-span-2">Post Ride</button>
    </div>
  )
}
