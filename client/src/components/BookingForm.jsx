import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import ReCAPTCHA from 'react-google-recaptcha'

export default function BookingForm({ rideId }) {
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!captchaToken) {
      setError('Please verify you are not a robot.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('https://ride-along-api.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ rideId, ...userData, captcha: captchaToken }),
      })

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('profile', JSON.stringify(userData))
        navigate(`/booking-success/${rideId}`)
      } else {
        setError(data.message || 'Booking failed!')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Booking error:', err)
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

      {error && <p className="text-red-400 text-sm bg-red-100 p-2 rounded text-center">{error}</p>}

      <input
        name="name"
        type="text"
        value={userData.name || ''}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full p-2 rounded text-black"
        required
      />

      <input
        name="age"
        type="number"
        min="1"
        max="120"
        value={userData.age || ''}
        onChange={handleChange}
        placeholder="Age"
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
        <option value="">Select Gender</option>
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
        placeholder="Email"
        className="w-full p-2 rounded text-black"
        required
      />

      <input
        name="phone"
        type="tel"
        value={userData.phone || ''}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full p-2 rounded text-black"
        required
      />

      {/* 🔐 Google reCAPTCHA */}
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
          'Confirm Booking'
        )}
      </button>
    </form>
  )
}

BookingForm.propTypes = {
  rideId: PropTypes.string.isRequired,
          }
