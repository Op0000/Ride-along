import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import ReCAPTCHA from 'react-google-recaptcha'

export default function BookingForm({ rideId, onBookingSuccess, currentSeatsAvailable = 1, ridePrice = 0 }) {
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const [seatsToBook, setSeatsToBook] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('profile')) || {}
    setUserData(stored)
  }, [])

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleCaptcha = (value) => {
    setCaptchaToken(value)
    if (error) setError('')
  }

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'age', 'gender']
    const missingFields = requiredFields.filter(field => !userData[field]?.trim())
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return false
    }

    if (!captchaToken) {
      setError('Please verify you are not a robot.')
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      setError('Please enter a valid email address.')
      return false
    }

    // Age validation
    const age = parseInt(userData.age)
    if (age < 18 || age > 120) {
      setError('Age must be between 18 and 120 years.')
      return false
    }

    // Seats validation
    if (seatsToBook < 1 || seatsToBook > currentSeatsAvailable) {
      setError(`Please select between 1 and ${currentSeatsAvailable} seats.`)
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validateForm()) {
      setLoading(false)
      return
    }

    const userId = localStorage.getItem('uid')
    const token = localStorage.getItem('token')

    if (!userId || !token) {
      setError('You must be logged in to book a ride. Please refresh the page and try again.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('https://ride-along-api.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rideId,
          userId,
          userEmail: userData.email,
          userName: userData.name,
          userPhone: userData.phone,
          userAge: parseInt(userData.age),
          userGender: userData.gender,
          seatsBooked: seatsToBook,
          captcha: captchaToken
        }),
      })

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('profile', JSON.stringify(userData))
        
        // Show success message with email confirmation info
        alert(`✅ Booking successful! 
        
🎫 ${seatsToBook} seat(s) booked
📧 Confirmation emails sent to you and the driver
🚗 ${data.remainingSeats} seats remaining

You will be redirected to the booking confirmation page.`)

        // Call the success callback to refresh ride data
        if (onBookingSuccess) {
          onBookingSuccess()
        }
        
        navigate(`/booking-success/${rideId}`)
      } else {
        setError(data.error || data.message || 'Booking failed!')
        // Reset captcha on error
        setCaptchaToken(null)
        window.grecaptcha?.reset()
      }
    } catch (err) {
      console.error('Booking error:', err)
      setError('Network error. Please check your connection and try again.')
      // Reset captcha on error
      setCaptchaToken(null)
      window.grecaptcha?.reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-zinc-800 p-6 rounded-xl shadow-2xl max-w-lg mx-auto text-white border border-blue-500 backdrop-blur-md"
    >
      <h2 className="text-2xl font-bold text-center">Book This Ride</h2>

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-500 p-3 rounded text-center">
          {error}
        </p>
      )}

      <input
        name="name"
        type="text"
        value={userData.name || ''}
        onChange={handleChange}
        placeholder="Full Name *"
        className="w-full p-2 rounded text-black"
        required
      />

      <input
        name="age"
        type="number"
        min="18"
        max="120"
        value={userData.age || ''}
        onChange={handleChange}
        placeholder="Age (18+) *"
        className="w-full p-2 rounded text-black"
        required
      />

      <select
        name="gender"
        value={userData.gender || ''}
        onChange={handleChange}
        className="w-full p-2 rounded text-black"
        required
      >
        <option value="">Select Gender *</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        <option value="prefer-not-to-say">Prefer not to say</option>
      </select>

      <input
        name="email"
        type="email"
        value={userData.email || ''}
        onChange={handleChange}
        placeholder="Email *"
        className="w-full p-2 rounded text-black"
        required
      />

      <input
        name="phone"
        type="tel"
        value={userData.phone || ''}
        onChange={handleChange}
        placeholder="Phone Number *"
        className="w-full p-2 rounded text-black"
        required
      />

      {/* Seat Selection */}
      <div>
        <label className="block text-sm mb-1 text-purple-300">Number of Seats *</label>
        <select
          value={seatsToBook}
          onChange={(e) => {
            setSeatsToBook(parseInt(e.target.value))
            if (error) setError('')
          }}
          className="w-full p-2 rounded text-black"
          required
        >
          {Array.from({ length: currentSeatsAvailable }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>
              {num} seat{num > 1 ? 's' : ''} {ridePrice > 0 ? `- ₹${num * ridePrice}` : ''}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">
          {currentSeatsAvailable} seat{currentSeatsAvailable > 1 ? 's' : ''} available
          {ridePrice > 0 && seatsToBook > 0 && (
            <span className="text-green-400 font-semibold ml-2">
              Total: ₹{seatsToBook * ridePrice}
            </span>
          )}
        </p>
      </div>

      <div className="flex justify-center">
        <ReCAPTCHA
          sitekey="6LdlI4UrAAAAAFDXPMbQCK7lo79hzsr1AkB_Acyb"
          onChange={handleCaptcha}
          theme="dark"
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 w-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Booking...
          </>
        ) : (
          `Confirm Booking (${seatsToBook} seat${seatsToBook > 1 ? 's' : ''})`
        )}
      </button>
    </form>
  )
}

BookingForm.propTypes = {
  rideId: PropTypes.string.isRequired,
  onBookingSuccess: PropTypes.func,
  currentSeatsAvailable: PropTypes.number,
  ridePrice: PropTypes.number
}
