import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'

export default function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const auth = getAuth()
    setUser(auth.currentUser)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">👤 Profile</h1>

      {user ? (
        <div className="space-y-4 bg-zinc-800 p-4 rounded-lg">
          <div><strong>Name:</strong> {user.displayName}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>UID:</strong> {user.uid}</div>
          {/* Later we'll add user bookings here */}
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  )
}
