
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    theme: 'dark',
    language: 'en'
  })

  const steps = [
    {
      title: 'Welcome to Ride Along! 🚗',
      subtitle: 'Let\'s get you set up in just a few steps',
      component: WelcomeStep
    },
    {
      title: 'Personal Information',
      subtitle: 'Help us know you better',
      component: ProfileStep
    },
    {
      title: 'Preferences',
      subtitle: 'Customize your experience',
      component: PreferencesStep
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save onboarding data and complete
      localStorage.setItem('onboardingComplete', 'true')
      localStorage.setItem('userPreferences', JSON.stringify(onboardingData))
      onComplete(onboardingData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateData = (newData) => {
    setOnboardingData(prev => ({ ...prev, ...newData }))
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-800 rounded-xl p-8 max-w-md w-full"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-zinc-400 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-zinc-400">
            {steps[currentStep].subtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CurrentStepComponent 
              data={onboardingData} 
              updateData={updateData}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg ${
              currentStep === 0 
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
                : 'bg-zinc-600 hover:bg-zinc-500 text-white'
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function WelcomeStep() {
  return (
    <div className="text-center space-y-4">
      <div className="text-6xl mb-4">🎉</div>
      <p className="text-zinc-300">
        Welcome to the smartest way to share rides in Uttar Pradesh! 
        Let's set up your profile and preferences.
      </p>
    </div>
  )
}

function ProfileStep({ data, updateData }) {
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        name="name"
        value={data.name}
        onChange={handleChange}
        placeholder="Your Name"
        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg border border-zinc-600 focus:border-purple-500 focus:outline-none"
        required
      />
      <input
        type="tel"
        name="phone"
        value={data.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg border border-zinc-600 focus:border-purple-500 focus:outline-none"
        required
      />
      <input
        type="number"
        name="age"
        value={data.age}
        onChange={handleChange}
        placeholder="Age"
        min="18"
        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg border border-zinc-600 focus:border-purple-500 focus:outline-none"
        required
      />
      <select
        name="gender"
        value={data.gender}
        onChange={handleChange}
        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg border border-zinc-600 focus:border-purple-500 focus:outline-none"
        required
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
  )
}

function PreferencesStep({ data, updateData }) {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' }
  ]

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <label className="block text-purple-300 mb-3 font-medium">Choose Theme</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateData({ theme: 'dark' })}
            className={`p-4 rounded-lg border-2 transition-all ${
              data.theme === 'dark' 
                ? 'border-purple-500 bg-purple-900 bg-opacity-30' 
                : 'border-zinc-600 bg-zinc-700'
            }`}
          >
            <div className="text-2xl mb-2">🌙</div>
            <div className="text-sm">Dark Mode</div>
          </button>
          <button
            onClick={() => updateData({ theme: 'light' })}
            className={`p-4 rounded-lg border-2 transition-all ${
              data.theme === 'light' 
                ? 'border-purple-500 bg-purple-900 bg-opacity-30' 
                : 'border-zinc-600 bg-zinc-700'
            }`}
          >
            <div className="text-2xl mb-2">☀️</div>
            <div className="text-sm">Light Mode</div>
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div>
        <label className="block text-purple-300 mb-3 font-medium">Choose Language</label>
        <select
          value={data.language}
          onChange={(e) => updateData({ language: e.target.value })}
          className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg border border-zinc-600 focus:border-purple-500 focus:outline-none"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
