import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'

export default function Profile() {
  const auth = getAuth()
  const user = auth.currentUser

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.displayName || '',
        age: '',
        gender: '',
        phone: '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = () => setIsEditing(true)

  const handleSave = () => {
    setIsEditing(false)
    // You can send formData to the backend or database here
    console.log('Saved profile data:', formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-zinc-900 text-white flex justify-center items-center p-4">
      <div className="bg-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-purple-400 text-center">👤 Profile</h1>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-zinc-400 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 transition-all duration-300 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-purple-500' : 'opacity-60 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-zinc-400 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 transition-all duration-300 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-purple-500' : 'opacity-60 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-zinc-400 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 transition-all duration-300 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-purple-500' : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-zinc-400 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 transition-all duration-300 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-purple-500' : 'opacity-60 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Email (Non-editable) */}
          <div>
            <label className="block text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold text-white transition-all"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold text-white transition-all"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
      }
