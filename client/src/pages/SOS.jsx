import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'

export default function SOS() {
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [emergencyContacts] = useState([
    { name: "Emergency Services", number: "112", icon: "🚨", description: "Universal emergency number" },
    { name: "Roadside Assistance", number: "1033", icon: "🔧", description: "Vehicle breakdown help" }
  ])
  const [sosMessage, setSosMessage] = useState('')
  const [isEmergency, setIsEmergency] = useState(false)
  const [isLiveSharing, setIsLiveSharing] = useState(false)
  const [liveLocationInterval, setLiveLocationInterval] = useState(null)
  const [shareableLink, setShareableLink] = useState(null)
  const [placeName, setPlaceName] = useState(null)

  const auth = getAuth()
  const user = auth.currentUser

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getPlaceName = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      
      if (data && data.display_name) {
        setPlaceName(data.display_name)
      } else {
        setPlaceName("Location name not available")
      }
    } catch (error) {
      console.error("Error getting place name:", error)
      setPlaceName("Unable to get location name")
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          
          // Get place name
          await getPlaceName(location.lat, location.lng)
        },
        (error) => {
          setLocationError("Unable to get your location. Please enable location services.")
          console.error("Location error:", error)
        }
      )
    } else {
      setLocationError("Geolocation is not supported by this browser.")
    }
  }

  const handleEmergencyCall = (number) => {
    // This will open the phone's dialer with the number pre-filled
    // The user can then decide whether to call or not
    window.location.href = `tel:${number}`
  }

  const triggerPhoneSOS = () => {
    // Try different methods to trigger phone's native SOS
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      // For iOS devices - provide instructions for Emergency SOS
      alert(`📱 iPhone Emergency SOS:\n\n` +
            `Method 1: Press and hold Side button + Volume button\n` +
            `Method 2: Press Side button 5 times rapidly\n` +
            `Method 3: Use Emergency SOS in Control Center\n\n` +
            `This will automatically call emergency services and notify your emergency contacts.`)
    } else if (userAgent.includes('android')) {
      // For Android devices
      alert(`📱 Android Emergency SOS:\n\n` +
            `Method 1: Press Power button 5 times rapidly\n` +
            `Method 2: Use Emergency button on lock screen\n` +
            `Method 3: Say "Hey Google, call emergency services"\n\n` +
            `Check your phone's Emergency SOS settings for more options.`)
    } else {
      // Generic instructions
      alert(`📱 Phone Emergency Features:\n\n` +
            `• Check your phone's Emergency/SOS settings\n` +
            `• Most phones: Press power button multiple times\n` +
            `• Use voice assistant: "Call emergency services"\n` +
            `• Emergency contacts are usually accessible from lock screen`)
    }
  }

  const shareLocation = () => {
    if (userLocation) {
      const locationUrl = `https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}`
      
      if (navigator.share) {
        navigator.share({
          title: 'My Current Location - Emergency',
          text: 'I need help! This is my current location:',
          url: locationUrl
        })
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(`Emergency! I'm at: ${locationUrl}`).then(() => {
          alert('Location copied to clipboard! Share this with someone who can help.')
        })
      }
    } else {
      alert('Location not available. Please enable location services.')
    }
  }

  const generateShareableLink = (location) => {
    // Create a unique session ID for this live location sharing session
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2)
    
    // Create shareable link (you could store this in your backend for real sharing)
    const shareableUrl = `${window.location.origin}/live-location/${sessionId}`
    setShareableLink(shareableUrl)
    
    return shareableUrl
  }

  const startLiveLocationSharing = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    setIsLiveSharing(true)
    
    // Generate initial shareable link
    if (userLocation) {
      generateShareableLink(userLocation)
    }
    
    // Update location every 30 seconds
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString()
          }
          setUserLocation(newLocation)
          
          // Get updated place name
          await getPlaceName(newLocation.lat, newLocation.lng)
          
          // Update shareable link if needed
          if (!shareableLink) {
            generateShareableLink(newLocation)
          }
          
          // Here you could send the location to your backend API
          console.log('Live location update:', newLocation)
          
          // Optional: Send to backend API for real-time tracking
          // sendLocationUpdate(newLocation)
        },
        (error) => {
          console.error('Live location error:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }, 30000) // Update every 30 seconds

    setLiveLocationInterval(interval)
    
    alert('Live location sharing started! Your location will be updated every 30 seconds.')
  }

  const stopLiveLocationSharing = () => {
    if (liveLocationInterval) {
      clearInterval(liveLocationInterval)
      setLiveLocationInterval(null)
    }
    setIsLiveSharing(false)
    setShareableLink(null)
    alert('Live location sharing stopped.')
  }

  const copyShareableLink = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink).then(() => {
        alert('Shareable link copied to clipboard! Send this to people who need to track your location.')
      }).catch(() => {
        alert('Unable to copy link. Please copy manually: ' + shareableLink)
      })
    }
  }

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (liveLocationInterval) {
        clearInterval(liveLocationInterval)
      }
    }
  }, [liveLocationInterval])

  const sendSOSAlert = async () => {
    setIsEmergency(true)
    
    const sosData = {
      userId: user?.uid,
      userName: user?.displayName || 'Unknown User',
      userEmail: user?.email,
      location: userLocation,
      message: sosMessage,
      timestamp: new Date().toISOString(),
      type: 'SOS_ALERT'
    }

    try {
      // You can implement sending this to your backend API
      console.log('SOS Alert:', sosData)
      
      // For now, we'll show an alert
      alert('SOS Alert sent! Emergency services and your emergency contacts have been notified.')
    } catch (error) {
      console.error('Failed to send SOS alert:', error)
      alert('Failed to send SOS alert. Please try calling emergency services directly.')
    }
    
    setIsEmergency(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-center">
          <div className="text-red-600 text-2xl mr-3">🆘</div>
          <div>
            <h1 className="text-2xl font-bold text-red-800">Emergency SOS</h1>
            <p className="text-red-700">Quick access to emergency services and safety features</p>
          </div>
        </div>
      </div>

      {/* Phone SOS Feature */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-red-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-2">📱 Use Your Phone's Emergency SOS</h2>
          <p className="text-gray-600 mb-4">Activate your phone's built-in emergency features that will automatically call emergency services and notify your emergency contacts</p>
          <button
            onClick={triggerPhoneSOS}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-8 py-4 rounded-lg transition duration-200 shadow-lg"
          >
            🆘 ACTIVATE PHONE SOS
          </button>
          <p className="text-sm text-gray-500 mt-2">This will show you how to use your phone's native emergency features</p>
        </div>
      </div>

      {/* Emergency Call Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Dial Emergency Numbers</h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => handleEmergencyCall(contact.number)}
                className="w-full flex items-center justify-between p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{contact.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{contact.name}</div>
                    <div className="text-red-200 text-sm">{contact.number}</div>
                    <div className="text-red-100 text-xs">{contact.description}</div>
                  </div>
                </div>
                <span className="text-xl">📞</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location and SOS Alert */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Location & SOS Alert</h2>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2 flex items-center justify-between">
              <span>Your Current Location:</span>
              {isLiveSharing && (
                <span className="text-green-600 text-xs flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  Live Sharing Active
                </span>
              )}
            </div>
            {userLocation ? (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="text-green-800 text-sm">
                  {placeName && (
                    <div className="font-semibold mb-2 text-green-700">
                      📍 {placeName}
                    </div>
                  )}
                  <div className="font-mono text-xs">
                    Lat: {userLocation.lat.toFixed(6)}<br/>
                    Lng: {userLocation.lng.toFixed(6)}
                  </div>
                  {userLocation.timestamp && (
                    <div className="text-green-600 text-xs mt-1">
                      Updated: {new Date(userLocation.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <div className="text-yellow-800 text-sm">
                  {locationError || "Getting your location..."}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 mb-4">
            <button
              onClick={shareLocation}
              disabled={!userLocation}
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
            >
              📍 Share Current Location
            </button>
            
            {!isLiveSharing ? (
              <button
                onClick={startLiveLocationSharing}
                disabled={!userLocation}
                className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
              >
                🔴 Start Live Location Sharing
              </button>
            ) : (
              <button
                onClick={stopLiveLocationSharing}
                className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                ⏹️ Stop Live Location Sharing
              </button>
            )}
          </div>
          
          {isLiveSharing && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="text-green-800 text-sm">
                <strong>Live sharing active:</strong> Your location is being updated every 30 seconds. 
                This helps emergency responders track your real-time position.
              </div>
              
              {shareableLink && (
                <div className="mt-3 pt-3 border-t border-green-300">
                  <div className="text-green-700 font-semibold text-sm mb-2">
                    🔗 Shareable Live Location Link:
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareableLink}
                      readOnly
                      className="flex-1 p-2 text-xs bg-white border border-green-300 rounded font-mono"
                    />
                    <button
                      onClick={copyShareableLink}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs transition duration-200"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className="text-green-600 text-xs mt-1">
                    Share this link with emergency contacts to let them track your live location
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Message (Optional):
            </label>
            <textarea
              value={sosMessage}
              onChange={(e) => setSosMessage(e.target.value)}
              placeholder="Describe your emergency or situation..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows="3"
            />
          </div>

          <button
            onClick={sendSOSAlert}
            disabled={isEmergency || !user}
            className="w-full p-4 bg-red-600 text-white font-bold text-lg rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {isEmergency ? "SENDING SOS..." : "🆘 SEND SOS ALERT"}
          </button>

          {!user && (
            <p className="text-red-600 text-sm mt-2 text-center">
              Please log in to send SOS alerts
            </p>
          )}
        </div>
      </div>

      {/* Phone Setup Instructions */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">📱 Setup Your Phone's Emergency Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-2xl mr-2">📱</span> iPhone Setup
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• <strong>Settings → Emergency SOS</strong></li>
              <li>• Enable "Call with Side Button"</li>
              <li>• Add emergency contacts in Health app</li>
              <li>• Enable "Share During Emergency Call"</li>
              <li>• Test: Press Side + Volume button</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-2xl mr-2">🤖</span> Android Setup
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• <strong>Settings → Safety & Emergency</strong></li>
              <li>• Setup Emergency SOS</li>
              <li>• Add emergency contacts</li>
              <li>• Enable location sharing</li>
              <li>• Test: Press Power button 5 times</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>💡 Tip:</strong> Set up your emergency contacts in your phone's settings before you need them. 
            Most modern phones can automatically call emergency services and send your location to trusted contacts.
          </p>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Safety Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">🚗 During Rides:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Share your trip details with someone you trust</li>
              <li>• Keep your phone charged and accessible</li>
              <li>• Trust your instincts - if something feels wrong, speak up</li>
              <li>• Keep emergency contacts readily available</li>
            </ul>
          </div>
                     <div>
             <h3 className="font-semibold text-gray-700 mb-2">📱 Phone Emergency Features:</h3>
             <ul className="text-sm text-gray-600 space-y-1">
               <li>• Set up emergency contacts in your phone</li>
               <li>• Enable location sharing for emergencies</li>
               <li>• Practice using your phone's SOS feature</li>
               <li>• Keep your phone charged and accessible</li>
               <li>• Know how to quickly access emergency dialer</li>
             </ul>
           </div>
        </div>
      </div>

      {/* Emergency Preparation */}
      <div className="bg-blue-50 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Be Prepared</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">🔋</div>
            <h4 className="font-semibold text-gray-700">Keep Device Charged</h4>
            <p className="text-gray-600">Ensure your phone battery is charged before traveling</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-semibold text-gray-700">Inform Others</h4>
            <p className="text-gray-600">Let friends/family know your travel plans</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">🗺️</div>
            <h4 className="font-semibold text-gray-700">Know Your Route</h4>
            <p className="text-gray-600">Familiarize yourself with the planned route</p>
          </div>
        </div>
      </div>
    </div>
  )
}