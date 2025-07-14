import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'

export default function Profile() {
  const auth = getAuth()
  const user = auth.currentUser
  const [details, setDetails] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: ''
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const API_BASE = 'https://ride-along-api.onrender.com/api/users'

  useEffect(() => {
    if (!user) return

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/${user.uid}`)
        if (res.ok) {
          const data = await res.json()
          setDetails(data)
        } else {
          setDetails({ ...details, email: user.email, name: user.displayName })
        }
      } catch (err) {
        console.error('Fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [user])

  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, ...details })
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">Your Profile</h1>
      <div className="bg-zinc-800 p-6 rounded-xl max-w-md mx-auto space-y-4 shadow-lg">
        {['name', 'age', 'gender', 'phone', 'email'].map((field) => (
          <div key={field}>
            <label className="block text-sm mb-1 capitalize">{field}</label>
            <input
              name={field}
              type={field === 'age' ? 'number' : 'text'}
              value={details[field] || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Save Changes
        </button>

        {saved && (
          <p className="text-green-400 text-center animate-pulse mt-2">✅ Profile updated</p>
        )}
      </div>
    </div>
  )
}
