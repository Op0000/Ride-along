
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../utils/api.js';

export default function AdminVerify() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setError('Please login first');
        return;
      }

      const token = await currentUser.getIdToken();
      
      const response = await fetch(`${API_BASE}/api/verify/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (uid, isVerified) => {
    try {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        alert('Please login first');
        return;
      }

      const token = await currentUser.getIdToken();
      
      const response = await fetch(`${API_BASE}/api/verify/admin/${uid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isVerified })
      });

      if (!response.ok) {
        throw new Error('Failed to update verification status');
      }

      const data = await response.json();
      alert(data.message);
      
      // Refresh the user list
      fetchUsers();
    } catch (err) {
      console.error('Error updating verification:', err);
      alert('Error updating verification: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin - Driver Verification</h1>
        
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
                  <tr key={user.uid} className="bg-gray-800 border-b border-gray-700">
                    <td className="px-6 py-4 font-mono text-xs">{user.uid}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
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
                    <td className="px-6 py-4 space-x-2">
                      {!user.isVerified && (
                        <button
                          onClick={() => updateVerificationStatus(user.uid, true)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Verify
                        </button>
                      )}
                      {user.isVerified && (
                        <button
                          onClick={() => updateVerificationStatus(user.uid, false)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Unverify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No users have submitted verification documents yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
