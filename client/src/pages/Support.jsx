import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Support() {
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    preferredTime: '',
    message: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleEmailSubmit = async (e) => {
  e.preventDefault()
  setSubmitting(true)
  setSubmitStatus('Sending email...')

  try {
    const res = await fetch('https://ride-along-api.onrender.com/api/support/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailForm)
    })

    const data = await res.json()
    setSubmitting(false)
    if (res.ok) {
      setSubmitStatus(data.message)
      setEmailForm({ name: '', email: '', subject: '', message: '' })
    } else {
      setSubmitStatus(data.error || 'Failed to send email.')
    }
  } catch (err) {
    console.error('Support email error:', err)
    setSubmitStatus('Something went wrong. Try again later.')
    setSubmitting(false)
  }
  }
  
  const handleCallbackSubmit = async (e) => {
  e.preventDefault()
  setSubmitting(true)
  setSubmitStatus('Requesting callback...')

  try {
    const res = await fetch('https://ride-along-api.onrender.com/api/support/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(callbackForm)
    })

    const data = await res.json()
    setSubmitting(false)
    if (res.ok) {
      setSubmitStatus(data.message)
      setCallbackForm({ name: '', phone: '', preferredTime: '', message: '' })
    } else {
      setSubmitStatus(data.error || 'Callback request failed.')
    }
  } catch (err) {
    console.error('Callback error:', err)
    setSubmitStatus('Something went wrong. Try again later.')
    setSubmitting(false)
  }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Support Center 🛟
          </h1>
          <p className="text-zinc-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Need help with Ride Along? We're here to assist you 24/7. Choose from multiple ways to get support.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/sos"
            className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-xl text-center hover:from-red-700 hover:to-red-800 transition duration-300 transform hover:scale-105"
          >
            <div className="text-4xl mb-3">🚨</div>
            <h3 className="text-xl font-bold mb-2">Emergency SOS</h3>
            <p className="text-red-100">Immediate emergency assistance</p>
          </Link>
          
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-xl text-center">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="text-xl font-bold mb-2">24/7 Helpline</h3>
            <p className="text-green-100 mb-2">+91-XXX-XXX-XXXX</p>
            <p className="text-green-200 text-sm">Available round the clock</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl text-center">
            <div className="text-4xl mb-3">✉️</div>
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-blue-100 mb-2">help.trenddash@gmail.com</p>
            <p className="text-blue-200 text-sm">Response within 24 hours</p>
          </div>
        </div>

        {/* Live Chat Section */}
        <section className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl p-8 border border-zinc-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-400 mb-4">💬 Live Chat Support</h2>
            <p className="text-zinc-300 text-lg">
              Get instant help from our support agents
            </p>
          </div>
          
          <div className="bg-zinc-700 rounded-xl p-12 text-center border-2 border-dashed border-zinc-600">
            <div className="text-zinc-400 text-lg mb-4">
              💬 Live chatbot will load here
            </div>
            <p className="text-zinc-500 text-sm">
              Chat widget will be integrated with Tidio for real-time support
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl p-8 border border-zinc-700">
          <h2 className="text-3xl font-bold text-purple-400 mb-8 text-center">❓ Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-zinc-700 p-6 rounded-xl border border-zinc-600">
                <h3 className="text-xl font-semibold text-white mb-3">🚗 How do I book a ride?</h3>
                <p className="text-zinc-300">Search for rides, select your preferred option, and click "Book Now". You'll receive confirmation via email and SMS.</p>
              </div>
              
              <div className="bg-zinc-700 p-6 rounded-xl border border-zinc-600">
                <h3 className="text-xl font-semibold text-white mb-3">💰 What payment methods do you accept?</h3>
                <p className="text-zinc-300">We accept UPI, credit/debit cards, net banking, and digital wallets. All payments are secure and encrypted.</p>
              </div>
              
              <div className="bg-zinc-700 p-6 rounded-xl border border-zinc-600">
                <h3 className="text-xl font-semibold text-white mb-3">📱 How does the SOS feature work?</h3>
                <p className="text-zinc-300">Press the SOS button to share your live location with emergency contacts and alert local authorities immediately.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-zinc-700 p-6 rounded-xl border border-zinc-600">
                <h3 className="text-xl font-semibold text-white mb-3">🔄 Can I cancel my booking?</h3>
                <p className="text-zinc-300">Yes, you can cancel up to 2 hours before departure. Cancellation charges may apply based on timing.</p>
              </div>
              
              <div className="bg-zinc-700 p-6 rounded-xl border border-zinc-600">
                <h3 className="text-xl font-semibold text-white mb-3">🛡️ Is my data safe?</h3>
                <p className="text-zinc-300">Absolutely! We use end-to-end encryption and follow strict privacy policies to protect your personal information.</p>
              </div>
              
              <div className="bg-zinc-700 p-6 rounded-xl border border-zinc-600">
                <h3 className="text-xl font-semibold text-white mb-3">🌍 Where do you operate?</h3>
                <p className="text-zinc-300">We operate PAN India with coverage in all major cities and intercity routes. Check our coverage map for details.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Forms */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Email Support Form */}
          <section className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl p-8 border border-zinc-700">
            <h2 className="text-3xl font-bold text-purple-400 mb-6">📧 Send us an Email</h2>
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email-name" className="block text-sm font-medium text-zinc-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="email-name"
                  value={emailForm.name}
                  onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email-address"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label htmlFor="email-subject" className="block text-sm font-medium text-zinc-300 mb-2">
                  Subject
                </label>
                <select
                  id="email-subject"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="booking">Booking Issues</option>
                  <option value="payment">Payment Problems</option>
                  <option value="technical">Technical Support</option>
                  <option value="safety">Safety Concerns</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="email-message" className="block text-sm font-medium text-zinc-300 mb-2">
                  Message
                </label>
                <textarea
                  id="email-message"
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-vertical"
                  placeholder="Describe your issue or question in detail..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
              >
                {submitting ? 'Sending...' : 'Send Email'}
              </button>
            </form>
          </section>

          {/* Callback Request Form */}
          <section className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl p-8 border border-zinc-700">
            <h2 className="text-3xl font-bold text-purple-400 mb-6">📞 Request a Call Back</h2>
            <form onSubmit={handleCallbackSubmit} className="space-y-6">
              <div>
                <label htmlFor="callback-name" className="block text-sm font-medium text-zinc-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="callback-name"
                  value={callbackForm.name}
                  onChange={(e) => setCallbackForm({...callbackForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="callback-phone" className="block text-sm font-medium text-zinc-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="callback-phone"
                  value={callbackForm.phone}
                  onChange={(e) => setCallbackForm({...callbackForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="Enter your phone number with country code"
                  required
                />
              </div>

              <div>
                <label htmlFor="callback-time" className="block text-sm font-medium text-zinc-300 mb-2">
                  Preferred Time <span className="text-zinc-500">(Optional)</span>
                </label>
                <select
                  id="callback-time"
                  value={callbackForm.preferredTime}
                  onChange={(e) => setCallbackForm({...callbackForm, preferredTime: e.target.value})}
                  className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 8 PM)</option>
                  <option value="anytime">Anytime (9 AM - 8 PM)</option>
                </select>
              </div>

              <div>
                <label htmlFor="callback-message" className="block text-sm font-medium text-zinc-300 mb-2">
                  Brief Description
                </label>
                <textarea
                  id="callback-message"
                  value={callbackForm.message}
                  onChange={(e) => setCallbackForm({...callbackForm, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-vertical"
                  placeholder="Brief description of your inquiry or issue..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
              >
                {submitting ? 'Requesting...' : 'Request Callback'}
              </button>
            </form>
          </section>
        </div>

        {/* Status Message */}
        {submitStatus && (
          <div className="bg-green-800 border border-green-600 p-4 rounded-lg text-center">
            <p className="text-green-200">{submitStatus}</p>
          </div>
        )}

        {/* Additional Resources */}
        <section className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl p-8 border border-zinc-700">
          <h2 className="text-3xl font-bold text-purple-400 mb-8 text-center">📚 Additional Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to="/about"
              className="bg-zinc-700 p-6 rounded-xl text-center hover:bg-zinc-600 transition duration-300 border border-zinc-600"
            >
              <div className="text-3xl mb-3">ℹ️</div>
              <h3 className="text-lg font-semibold text-white mb-2">About Us</h3>
              <p className="text-zinc-300 text-sm">Learn more about Ride Along</p>
            </Link>
            
            <Link 
              to="/privacy"
              className="bg-zinc-700 p-6 rounded-xl text-center hover:bg-zinc-600 transition duration-300 border border-zinc-600"
            >
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-white mb-2">Privacy Policy</h3>
              <p className="text-zinc-300 text-sm">How we protect your data</p>
            </Link>
            
            <Link 
              to="/terms"
              className="bg-zinc-700 p-6 rounded-xl text-center hover:bg-zinc-600 transition duration-300 border border-zinc-600"
            >
              <div className="text-3xl mb-3">📜</div>
              <h3 className="text-lg font-semibold text-white mb-2">Terms of Service</h3>
              <p className="text-zinc-300 text-sm">Service terms and conditions</p>
            </Link>
            
            <Link 
              to="/refund"
              className="bg-zinc-700 p-6 rounded-xl text-center hover:bg-zinc-600 transition duration-300 border border-zinc-600"
            >
              <div className="text-3xl mb-3">💸</div>
              <h3 className="text-lg font-semibold text-white mb-2">Refund Policy</h3>
              <p className="text-zinc-300 text-sm">Cancellation and refunds</p>
            </Link>
          </div>
        </section>

        {/* Emergency Notice */}
        <div className="bg-gradient-to-r from-red-900 to-red-800 p-6 rounded-xl border border-red-600 text-center">
          <div className="text-4xl mb-3">🚨</div>
          <h3 className="text-2xl font-bold text-red-100 mb-3">Emergency Assistance</h3>
          <p className="text-red-200 mb-4">
            For immediate emergency assistance during your ride, use our SOS feature or contact local emergency services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/sos"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
            >
              🆘 Emergency SOS
            </Link>
            <a 
              href="tel:112"
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
            >
              📞 Call 112
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
