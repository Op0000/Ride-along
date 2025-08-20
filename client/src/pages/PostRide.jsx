import { useState } from 'react'
import { getAuth } from 'firebase/auth'
import AutocompleteInput from '../components/AutocompleteInput'

export default function PostRide({ onPost }) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    via: '',
    price: '',
    seatsAvailable: '',
    driverName: '',
    driverContact: '',
    vehicleNumber: '',
    departureTime: ''
  })

  const [vehiclePhotos, setVehiclePhotos] = useState([])
  const [loading, setLoading] = useState(false)

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

      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key === 'price' || key === 'seatsAvailable') {
          formDataToSend.append(key, Number(formData[key]))
        } else if (key === 'via') {
          formDataToSend.append(key, formData.via ? formData.via.split(',').map(item => item.trim()) : [])
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      // Add vehicle photos
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
          price: '',
          seatsAvailable: '',
          driverName: '',
          driverContact: '',
          vehicleNumber: '',
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
      <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (₹)" required className="input" />
      <input type="number" name="seatsAvailable" value={formData.seatsAvailable} onChange={handleChange} placeholder="Seats Available" required className="input" />
      <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} placeholder="Driver's Name" required className="input" />
      <input type="text" name="driverContact" value={formData.driverContact} onChange={handleChange} placeholder="Driver Contact" required className="input" />
      <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="Vehicle Number" required className="input" />
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
