import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function LiveLocation() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [locationData, setLocationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchLocationData()
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchLocationData, 30000)
    
    return () => clearInterval(interval)
  }, [sessionId])

  const fetchLocationData = async () => {
    try {
      const response = await fetch(`https://ride-along-api.onrender.com/api/live-location/${sessionId}`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setLocationData(result.data)
          setLastUpdated(new Date())
          setError(null)
        } else {
          throw new Error('Invalid response format')
        }
      } else if (response.status === 404) {
        setError('Live location session not found or expired')
      } else {
        throw new Error('Failed to fetch location data')
      }
    } catch (err) {
      console.error('Error fetching location:', err)
      setError('Live location sharing session not found. This could be because:\n• The session has expired\n• The link is invalid\n• The person stopped sharing their location')
    } finally {
      setLoading(false)
    }
  }

  const openInMaps = () => {
    if (locationData && locationData.location) {
      const { lat, lng } = locationData.location
      const url = `https://maps.google.com/maps?q=${lat},${lng}`
      window.open(url, '_blank')
    }
  }

  const callEmergencyServices = () => {
    window.location.href = 'tel:112'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Live Location...</h2>
            <p className="text-gray-600">Fetching real-time location data</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Not Available</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm whitespace-pre-line">{error}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/sos')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                🆘 Go to Emergency SOS
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                🏠 Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🚨 Emergency Live Location</h1>
              <p className="text-red-100">Real-time location tracking</p>
            </div>
            <button
              onClick={callEmergencyServices}
              className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              📞 Call 112
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <h2 className="text-xl font-semibold text-gray-800">Live Location Active</h2>
            </div>
            {lastUpdated && (
              <div className="text-sm text-gray-600">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          {locationData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">👤 Person Details</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Name:</strong> {locationData.userName || 'Unknown'}</p>
                  <p><strong>Email:</strong> {locationData.userEmail || 'Not provided'}</p>
                  <p><strong>Started:</strong> {new Date(locationData.startTime || Date.now()).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">📍 Location Details</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Coordinates:</strong> {locationData.location?.lat?.toFixed(6)}, {locationData.location?.lng?.toFixed(6)}</p>
                  <p><strong>Address:</strong> {locationData.placeName || 'Getting address...'}</p>
                  <p><strong>Accuracy:</strong> {locationData.accuracy || 'Unknown'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Message */}
        {locationData?.message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ Emergency Message</h3>
            <p className="text-red-700">{locationData.message}</p>
          </div>
        )}

        {/* Map */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">📍 Location on Map</h3>
            <button
              onClick={openInMaps}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              🗺️ Open in Google Maps
            </button>
          </div>
          
          {locationData?.location ? (
            <div className="h-96 rounded-lg overflow-hidden">
              <MapContainer
                center={[locationData.location.lat, locationData.location.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[locationData.location.lat, locationData.location.lng]}>
                  <Popup>
                    <div className="text-center">
                      <strong>🚨 Emergency Location</strong><br/>
                      {locationData.userName || 'Person in need'}<br/>
                      <small>Updated: {lastUpdated?.toLocaleTimeString()}</small>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="text-4xl mb-2">📍</div>
                <p>No location data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={callEmergencyServices}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            📞 Call Emergency Services
          </button>
          
          <button
            onClick={openInMaps}
            disabled={!locationData?.location}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            🗺️ Directions in Maps
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            🔄 Refresh Location
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Instructions</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• This page shows real-time location of someone who shared their emergency location</li>
            <li>• The location updates automatically every 30 seconds</li>
            <li>• Use "Call Emergency Services" if immediate help is needed</li>
            <li>• Click "Directions in Maps" to get navigation to their location</li>
            <li>• Refresh the page to get the latest location update</li>
          </ul>
        </div>
      </div>
    </div>
  )
}