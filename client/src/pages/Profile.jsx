import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'

export default function Profile() {
  const auth = getAuth()
  const user = auth.currentUser

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: ''
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return
      const res = await fetch(`https://ride-along-api.onrender.com/api/users/${user.uid}`)
      const data = await res.json()
      setFormData({
        name: data.name || user.displayName || '',
        age: data.age || '',
        gender: data.gender || '',
        email: data.email || user.email || '',
        phone: data.phone || ''
      })
    }

    fetchUser()
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('https://ride-along-api.onrender.com/api/users/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, ...formData })
      })
      if (res.ok) alert('✅ Profile saved!')
    } catch (err) {
      alert('❌ Failed to save profile')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-xl mx-auto bg-zinc-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-3xl font-bold text-purple-400 mb-4">🧑 Profile Info</h2>

        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name"
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg" />
        <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age"
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg" />
        <input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender"
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email"
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone No."
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg" />

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold"
        >
          {saving ? 'Saving...' : '💾 Save Profile'}
        </button>
      </div>
    </div>
  )
}
