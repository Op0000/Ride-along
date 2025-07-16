import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default function Profile() {
  const auth = getAuth()
  const [user, setUser] = useState(null)
  const [details, setDetails] = useState({
    uid: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: ''
  })
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const API_BASE = 'https://ride-along-api.onrender.com/api'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed", currentUser)

      if (!currentUser) {
        setUser(null)
        setLoading(false)
        return
      }

      setUser(currentUser)

      try {
        const res = await fetch(`${API_BASE}/users/${currentUser.uid}`)
        const data = await res.json()
        console.log("Fetched user:", data)

        if (res.ok) {
          setDetails({ ...data, uid: currentUser.uid })
        } else {
          setDetails({
            uid: currentUser.uid,
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            age: '',
            gender: '',
            phone: ''
          })
        }

        const token = await currentUser.getIdToken()
        const rideRes = await fetch(`${API_BASE}/rides/mine`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const rideData = await rideRes.json()
        setRides(rideData)
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleCancelRide = async (rideId) => {
    if (!confirm("Cancel this ride?")) return

    try {
      const token = await user.getIdToken()
      const res = await fetch(`${API_BASE}/rides/${rideId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        setRides(prev => prev.filter(r => r._id !== rideId))
        alert("✅ Ride cancelled!")
      }
    } catch (err) {
      console.error("Cancel failed:", err)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (err) {
      console.error("Save failed:", err)
    }
  }

  // ✅ Loading fallback
  if (loading) return <div className="text-white text-center mt-10">Loading...</div>

  // ✅ Not logged in fallback
  if (!user) return <div className="text-red-400 text-center mt-10">Please login to view profile</div>

  return (
    <div className="p-4 text-white min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800">
      <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Your Profile</h1>

      <div className="bg-zinc-800 p-6 rounded-xl max-w-md mx-auto mb-10">
        {['uid', 'name', 'age', 'email', 'phone', 'gender'].map((key) => (
          <div key={key} className="mb-4">
            <label className="block text-sm mb-1 capitalize text-purple-300">{key}</label>
            <input
              name={key}
              type={key === 'age' ? 'number' : 'text'}
              value={details[key] || ''}
              onChange={handleChange}
              disabled={key === 'uid'}
              className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
            />
          </div>
        ))}

        <button onClick={handleSave} className="w-full bg-purple-600 py-2 mt-2 rounded">
          Save Changes
        </button>
        {saved && <p className="text-green-400 text-sm text-center mt-2">✅ Profile saved!</p>}
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl text-purple-300 font-bold mb-4">🛣️ Your Posted Rides</h2>
        {rides.length === 0 ? (
          <p className="text-zinc-400">No rides posted yet.</p>
        ) : (
          <div className="grid gap-4">
            {rides.map(ride => (
              <div key={ride._id} className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                <p><strong>From:</strong> {ride.from}</p>
                <p><strong>To:</strong> {ride.to}</p>
                <p><strong>Time:</strong> {new Date(ride.departureTime).toLocaleString()}</p>
                <p><strong>Seats:</strong> {ride.seatsAvailable}</p>
                <button
                  onClick={() => handleCancelRide(ride._id)}
                  className="mt-3 bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Cancel Ride
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
