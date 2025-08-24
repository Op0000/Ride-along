
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
      
      console.log('Fetching users from:', `${API_BASE}/api/verify/admin/all`);
      
      const response = await fetch(`${API_BASE}/api/verify/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', response.status, errorText);
        throw new Error(`Failed to fetch users: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched users data:', data);
      setUsers(data.users || []);
      
      if (!data.users || data.users.length === 0) {
        setError('No verification requests found. Users need to submit verification documents first.');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Unable to connect to server. Please try again later.');
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin - Driver Verification</h1>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-700 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <p className="text-gray-300">
                Total Verification Requests: <span className="font-bold text-white">{users.length}</span>
              </p>
              <div className="flex space-x-4 text-sm">
                <span className="text-green-400">
                  ✓ Verified: {users.filter(u => u.isVerified).length}
                </span>
                <span className="text-yellow-400">
                  ⏳ Pending: {users.filter(u => !u.isVerified).length}
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th className="px-6 py-3">UID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Submitted At</th>
                  <th className="px-6 py-3">Documents</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-750">
                    <td className="px-6 py-4 font-mono text-xs text-blue-400">{user.uid}</td>
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.submittedAt ? (
                        <div>
                          <div>{new Date(user.submittedAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(user.submittedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-red-400">Not submitted</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.hasDocuments ? (
                        <span className="text-green-400">📄 Available</span>
                      ) : (
                        <span className="text-red-400">❌ Missing</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isVerified 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {user.isVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {!user.isVerified && (
                        <button
                          onClick={() => updateVerificationStatus(user.uid, true)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          ✓ Verify
                        </button>
                      )}
                      {user.isVerified && (
                        <button
                          onClick={() => updateVerificationStatus(user.uid, false)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          ✗ Unverify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  No verification requests found
                </h3>
                <p className="text-gray-400 mb-4">
                  Users need to submit their verification documents first.
                </p>
                <button
                  onClick={fetchUsers}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Check for new requests
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Instructions</h3>
          <ul className="text-gray-300 space-y-1 text-sm">
            <li>• Users must upload verification documents through their profile</li>
            <li>• Click "Verify" to approve a user's driver verification</li>
            <li>• Click "Unverify" to revoke verification status</li>
            <li>• Use the refresh button to check for new verification requests</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
