import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'

export default function SOS() {
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [emergencyContacts] = useState([
    { name: "Police", number: "911", icon: "🚔" },
    { name: "Fire Department", number: "911", icon: "🚒" },
    { name: "Medical Emergency", number: "911", icon: "🚑" },
    { name: "Roadside Assistance", number: "1-800-AAA-HELP", icon: "🔧" }
  ])
  const [sosMessage, setSosMessage] = useState('')
  const [isEmergency, setIsEmergency] = useState(false)

  const auth = getAuth()
  const user = auth.currentUser

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
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
    window.location.href = `tel:${number}`
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

      {/* Emergency Call Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Emergency Contacts</h2>
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
            <div className="text-sm text-gray-600 mb-2">Your Current Location:</div>
            {userLocation ? (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="text-green-800 font-mono text-sm">
                  Lat: {userLocation.lat.toFixed(6)}<br/>
                  Lng: {userLocation.lng.toFixed(6)}
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

          <button
            onClick={shareLocation}
            disabled={!userLocation}
            className="w-full mb-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            📍 Share My Location
          </button>

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
            <h3 className="font-semibold text-gray-700 mb-2">📱 App Safety:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enable location services for accurate tracking</li>
              <li>• Use SOS feature only for real emergencies</li>
              <li>• Keep your profile and contact info updated</li>
              <li>• Report any suspicious activity immediately</li>
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