
import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import { API_BASE } from '../utils/api'

export default function AdminVerify() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        setError('Please log in to access admin panel')
        return
      }

      const token = await user.getIdToken()
      const response = await fetch(`${API_BASE}/api/verify/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load verification requests')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (uid) => {
    try {
      const user = auth.currentUser
      const token = await user.getIdToken()
      
      const response = await fetch(`${API_BASE}/api/users/profile/${uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserDetails(data.user)
      }
    } catch (err) {
      console.error('Error fetching user details:', err)
    }
  }

  const handleVerify = async (uid, isVerified) => {
    try {
      const user = auth.currentUser
      const token = await user.getIdToken()

      const response = await fetch(`${API_BASE}/api/verify/admin/${uid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isVerified })
      })

      if (!response.ok) {
        throw new Error('Failed to update verification status')
      }

      // Refresh users list
      fetchUsers()
      alert(`User ${isVerified ? 'verified' : 'unverified'} successfully`)
    } catch (err) {
      console.error('Error updating verification:', err)
      alert('Failed to update verification status')
    }
  }

  const openUserModal = (user) => {
    setSelectedUser(user)
    fetchUserDetails(user.uid)
  }

  const closeModal = () => {
    setSelectedUser(null)
    setUserDetails(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading verification requests...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin - Driver Verification</h1>
        
        {users.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <div className="text-gray-400 text-xl">No verification requests found</div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">UID</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Submitted At</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uid} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-750">
                      <td className="px-6 py-4 font-mono text-xs">{user.uid.substring(0, 10)}...</td>
                      <td className="px-6 py-4">{user.name || 'No name'}</td>
                      <td className="px-6 py-4">{user.email || 'No email'}</td>
                      <td className="px-6 py-4">
                        {user.submittedAt ? new Date(user.submittedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.isVerified 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openUserModal(user)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                          >
                            View
                          </button>
                          {!user.isVerified && (
                            <button
                              onClick={() => handleVerify(user.uid, true)}
                              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
                            >
                              Verify
                            </button>
                          )}
                          {user.isVerified && (
                            <button
                              onClick={() => handleVerify(user.uid, false)}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                            >
                              Unverify
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">User Verification Details</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong className="text-gray-300">Name:</strong> {selectedUser.name || 'Not provided'}</div>
                    <div><strong className="text-gray-300">Email:</strong> {selectedUser.email || 'Not provided'}</div>
                    <div><strong className="text-gray-300">UID:</strong> <span className="font-mono">{selectedUser.uid}</span></div>
                    <div><strong className="text-gray-300">Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedUser.isVerified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {selectedUser.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {userDetails && userDetails.driverVerification && userDetails.driverVerification.documents && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Submitted Documents</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(userDetails.driverVerification.documents).map(([docType, doc]) => (
                          <div key={docType} className="bg-gray-700 p-4 rounded">
                            <h4 className="font-medium text-gray-300 mb-2 capitalize">
                              {docType.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            {doc && doc.data && (
                              <img
                                src={`data:${doc.contentType};base64,${doc.data}`}
                                alt={docType}
                                className="w-full h-32 object-cover rounded border"
                              />
                            )}
                            <div className="text-xs text-gray-400 mt-2">
                              {doc?.filename || 'No filename'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    {!selectedUser.isVerified && (
                      <button
                        onClick={() => {
                          handleVerify(selectedUser.uid, true)
                          closeModal()
                        }}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                      >
                        Verify User
                      </button>
                    )}
                    {selectedUser.isVerified && (
                      <button
                        onClick={() => {
                          handleVerify(selectedUser.uid, false)
                          closeModal()
                        }}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                      >
                        Unverify User
                      </button>
                    )}
                    <button
                      onClick={closeModal}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
