import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import AutocompleteInput from '../components/AutocompleteInput'

export default function PostRide({ onPost }) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    via: '',
    pricePerKm: '8',
    price: '',
    distance: '',
    seatsAvailable: '',
    driverName: '',
    driverContact: '',
    vehicleNumber: '',
    car: '',
    departureTime: ''
  })

  const [vehiclePhotos, setVehiclePhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [checkingVerification, setCheckingVerification] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  // ✅ Check driver verification status
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const user = getAuth().currentUser
        if (!user) {
          setCheckingVerification(false)
          return
        }

        const token = await user.getIdToken()
        const res = await fetch('https://ride-along-api.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res.ok) {
          const data = await res.json()
          // 🔥 Fix: match your DB field (verification.status)
          setIsVerified(data?.verification?.status === "verified")
        }
      } catch (err) {
        console.error('Verification check error:', err)
      }
      setCheckingVerification(false)
    }

    checkVerification()
  }, [])

  // ✅ Distance & Price auto-calc
  useEffect(() => {
    const calculateDistance = async () => {
      if (formData.from && formData.to) {
        try {
          const fromCoords = await getLatLng(formData.from)
          const toCoords = await getLatLng(formData.to)
          
          if (fromCoords && toCoords) {
            const query = `${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}`
            const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${query}?overview=false`)
            const data = await res.json()
            
            if (data.routes?.[0]?.distance) {
              const distanceKm = Math.round(data.routes[0].distance / 1000)
              const calculatedPrice = Math.round(distanceKm * parseFloat(formData.pricePerKm || 8))
              
              setFormData(prev => ({
                ...prev,
                distance: distanceKm.toString(),
                price: calculatedPrice.toString()
              }))
            }
          }
        } catch (error) {
          console.error('Distance calculation error:', error)
        }
      }
    }

    calculateDistance()
  }, [formData.from, formData.to, formData.pricePerKm])

  const getLatLng = async (place) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&addressdetails=1`
      )
      const data = await res.json()
      if (data.length === 0) return null

      const location = data[0]
      const state = location.address?.state || ''

      if (!state.toLowerCase().includes('uttar pradesh')) return null

      return [parseFloat(location.lat), parseFloat(location.lon)]
    } catch (err) {
      console.error('Geocoding error:', err)
      return null
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAutocompleteChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      alert('Maximum 5 photos allowed')
      return
    }
    setVehiclePhotos(files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = getAuth().currentUser
      if (!user) {
        alert('Please login to post a ride')
        setLoading(false)
        return
      }

      const token = await user.getIdToken()

      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'price' || key === 'seatsAvailable') {
          formDataToSend.append(key, Number(formData[key]))
        } else if (key === 'via') {
          formDataToSend.append(key, formData.via ? formData.via.split(',').map(item => item.trim()) : [])
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      vehiclePhotos.forEach(photo => {
        formDataToSend.append('vehiclePhotos', photo)
      })

      const res = await fetch('https://ride-along-api.onrender.com/api/rides', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      })

      const result = await res.json()
      console.log('PostRide response status:', res.status)
      console.log('PostRide payload:', result)

      if (res.ok) {
        alert('✅ Ride posted successfully!')
        onPost?.()
        setFormData({
          from: '',
          to: '',
          via: '',
          pricePerKm: '8',
          price: '',
          distance: '',
          seatsAvailable: '',
          driverName: '',
          driverContact: '',
          vehicleNumber: '',
          car: '',
          departureTime: ''
        })
        setVehiclePhotos([])
      } else {
        alert(`❌ Failed to post ride: ${result.error || 'Unknown error'}`)
      }

    } catch (err) {
      console.error('❌ Caught error:', err)
      alert(`🚨 Error occurred: ${err.message}`)
    }

    setLoading(false)
  }

  // ✅ UI Restriction
  if (checkingVerification) {
    return (
      <div className="bg-zinc-800 p-4 rounded-lg text-center">
        <p className="text-purple-300">🔍 Checking driver verification...</p>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="bg-zinc-800 p-4 rounded-lg text-center">
        <p className="text-yellow-400 font-bold">⚠️ Only verified drivers can post rides.</p>
        <p className="text-zinc-400 mt-2">
          Please complete{" "}
          <a href="/profile" className="text-purple-400 underline">
            Driver Verification
          </a>{" "}
          to unlock this feature.
        </p>
      </div>
    )
  }

  // ✅ Show form if verified
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <AutocompleteInput
        name="from"
        placeholder="From"
        value={formData.from}
        onChange={handleAutocompleteChange}
      />
      <AutocompleteInput
        name="to"
        placeholder="To"
        value={formData.to}
        onChange={handleAutocompleteChange}
      />
      <input
        type="text"
        name="via"
        value={formData.via}
        onChange={handleChange}
        placeholder="Via (comma-separated)"
        className="input"
      />
      <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input 
          type="number" 
          name="pricePerKm" 
          value={formData.pricePerKm} 
          onChange={handleChange} 
          placeholder="Price per KM (₹)" 
          required 
          className="input" 
          min="1"
          step="0.5"
        />
        <input 
          type="text" 
          name="distance" 
          value={formData.distance ? `${formData.distance} km` : ''} 
          placeholder="Distance (auto-calculated)" 
          readOnly 
          className="input bg-gray-700 text-gray-300" 
        />
        <input 
          type="number" 
          name="price" 
          value={formData.price} 
          onChange={handleChange} 
          placeholder="Total Price (₹)" 
          required 
          className="input" 
        />
      </div>
      <input type="number" name="seatsAvailable" value={formData.seatsAvailable} onChange={handleChange} placeholder="Seats Available" required className="input" />
      <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} placeholder="Driver's Name" required className="input" />
      <input type="text" name="driverContact" value={formData.driverContact} onChange={handleChange} placeholder="Driver Contact" required className="input" />
      <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="Vehicle Number" required className="input" />
      <input type="text" name="car" value={formData.car} onChange={handleChange} placeholder="Car Model (e.g., Swift Dzire)" required className="input" />
      <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} required className="input" />

      <div className="col-span-full">
        <label className="block text-sm font-medium text-purple-300 mb-2">
          Vehicle Photos (Optional - Max 5)
        </label>
        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={handlePhotoChange}
          className="input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700"
        />
        {vehiclePhotos.length > 0 && (
          <div className="mt-2 text-sm text-green-400">
            {vehiclePhotos.length} photo(s) selected
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        {loading ? 'Posting...' : 'Post Ride'}
      </button>
    </form>
  )
        }
