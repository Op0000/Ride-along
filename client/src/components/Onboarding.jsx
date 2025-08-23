import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../utils/api'

export default function Onboarding({ onComplete }) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    age: '',
    theme: 'dark',
    language: 'en'
  })

  const steps = [
    {
      title: 'Complete Your Profile',
      component: ProfileStep
    },
    {
      title: 'Choose Your Theme',
      component: ThemeStep
    },
    {
      title: 'Select Language',
      component: LanguageStep
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      if (user) {
        const token = await user.getIdToken()

        // Save user profile
        await fetch(`${API_BASE}/api/users/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            age: parseInt(formData.age)
          })
        })

        // Save theme preference
        localStorage.setItem('theme', formData.theme)
        document.documentElement.setAttribute('data-theme', formData.theme)

        // Save language preference
        localStorage.setItem('language', formData.language)
      }

      onComplete()
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('Error completing setup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    if (currentStep === 0) {
      return formData.name.trim() && formData.phone.trim() && formData.age.trim()
    }
    return true
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{steps[currentStep].title}</h2>
            <span className="text-sm text-gray-400">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <CurrentStepComponent 
          formData={formData}
          setFormData={setFormData}
        />

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || loading}
            className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg"
          >
            {loading ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileStep({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 9876543210"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Age *
        </label>
        <input
          type="number"
          min="18"
          max="100"
          value={formData.age}
          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  )
}

function ThemeStep({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-300">Choose your preferred theme</p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setFormData(prev => ({ ...prev, theme: 'dark' }))}
          className={`p-4 rounded-lg border-2 ${
            formData.theme === 'dark' 
              ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <div className="bg-gray-800 h-16 rounded mb-2"></div>
          <span className="text-white">Dark Mode</span>
        </button>
        <button
          onClick={() => setFormData(prev => ({ ...prev, theme: 'light' }))}
          className={`p-4 rounded-lg border-2 ${
            formData.theme === 'light' 
              ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <div className="bg-white h-16 rounded mb-2 border"></div>
          <span className="text-white">Light Mode</span>
        </button>
      </div>
    </div>
  )
}

function LanguageStep({ formData, setFormData }) {
  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
  ]

  return (
    <div className="space-y-4">
      <p className="text-gray-300">Select your preferred language</p>
      <div className="max-h-48 overflow-y-auto space-y-2">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => setFormData(prev => ({ ...prev, language: lang.code }))}
            className={`w-full p-3 rounded-lg border text-left ${
              formData.language === lang.code
                ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-white">{lang.name}</span>
              <span className="text-gray-400 text-sm">{lang.native}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}