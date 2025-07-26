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
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false)
      setSubmitStatus('Email sent successfully! We\'ll respond within 24 hours.')
      setEmailForm({ name: '', email: '', subject: '', message: '' })
    }, 2000)
  }

  const handleCallbackSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus('Requesting callback...')
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false)
      setSubmitStatus('Callback request submitted! We\'ll contact you soon.')
      setCallbackForm({ name: '', phone: '', preferredTime: '', message: '' })
    }, 2000)
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
        <section className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Support Assistant</h2>
                  <p className="text-purple-100 text-sm">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Online - Usually replies instantly
                  </p>
                </div>
              </div>
              <div className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex flex-col h-96 md:h-[500px]">
            
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-zinc-800">
              
              {/* Welcome Message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  AI
                </div>
                <div className="bg-zinc-700 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%] md:max-w-[70%]">
                  <p className="text-white text-sm md:text-base leading-relaxed">
                    👋 Hi there! I'm your AI support assistant. I can help you with:
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="bg-zinc-600 rounded-lg px-3 py-2 text-sm">
                      🚗 Booking and ride issues
                    </div>
                    <div className="bg-zinc-600 rounded-lg px-3 py-2 text-sm">
                      💳 Payment and refund questions
                    </div>
                    <div className="bg-zinc-600 rounded-lg px-3 py-2 text-sm">
                      🛡️ Safety and emergency features
                    </div>
                    <div className="bg-zinc-600 rounded-lg px-3 py-2 text-sm">
                      📱 Technical support
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm mt-3">
                    What can I help you with today?
                  </p>
                </div>
              </div>

              {/* Sample User Message */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%] md:max-w-[70%]">
                  <p className="text-white text-sm md:text-base leading-relaxed">
                    How do I cancel my booking?
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  You
                </div>
              </div>

              {/* Sample AI Response */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  AI
                </div>
                <div className="bg-zinc-700 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%] md:max-w-[70%]">
                  <p className="text-white text-sm md:text-base leading-relaxed mb-3">
                    You can cancel your booking in a few easy steps:
                  </p>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
                      <span className="text-zinc-300">Go to your Profile page</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
                      <span className="text-zinc-300">Find your booking in "My Bookings"</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
                      <span className="text-zinc-300">Click "Cancel Booking"</span>
                    </div>
                  </div>
                  <div className="bg-amber-900 bg-opacity-50 border border-amber-600 rounded-lg p-3">
                    <p className="text-amber-200 text-sm">
                      ⚠️ <strong>Note:</strong> You can cancel up to 2 hours before departure. Cancellation charges may apply.
                    </p>
                  </div>
                </div>
              </div>

              {/* Typing Indicator */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  AI
                </div>
                <div className="bg-zinc-700 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="ml-2 text-zinc-400 text-sm">AI is typing...</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Chat Input Area */}
            <div className="border-t border-zinc-600 bg-zinc-800 p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    className="w-full bg-zinc-700 text-white border border-zinc-600 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 text-sm md:text-base"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-purple-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-xl transition duration-200 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-3 py-2 rounded-lg text-xs md:text-sm transition-colors">
                  🚗 Booking Help
                </button>
                <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-3 py-2 rounded-lg text-xs md:text-sm transition-colors">
                  💳 Payment Issues
                </button>
                <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-3 py-2 rounded-lg text-xs md:text-sm transition-colors">
                  🛡️ Safety Questions
                </button>
                <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-3 py-2 rounded-lg text-xs md:text-sm transition-colors">
                  📱 Technical Support
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-zinc-500 text-xs mt-3 text-center">
                💡 This is a demo chat interface. Real Tidio chat widget will be integrated here.
              </p>
            </div>

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