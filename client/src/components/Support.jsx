import React from 'react'

export default function Support() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission logic will be added later
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Support Center</h1>
          <p className="text-zinc-300 text-lg">
            We're here to help! Choose how you'd like to get in touch with us.
          </p>
        </div>

        {/* Chatbot Section */}
        <section className="bg-zinc-800 rounded-lg p-8 border border-zinc-700">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">Live Chat Support</h2>
          <div className="bg-zinc-700 rounded-lg p-12 text-center border-2 border-dashed border-zinc-600">
            <div className="text-zinc-400 text-lg">
              💬 Chatbot will load here
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-zinc-700"></div>

        {/* Support Email Form */}
        <section className="bg-zinc-800 rounded-lg p-8 border border-zinc-700">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">Send us an Email</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email-name" className="block text-sm font-medium text-zinc-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="email-name"
                name="name"
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
                name="email"
                className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label htmlFor="email-message" className="block text-sm font-medium text-zinc-300 mb-2">
                Message
              </label>
              <textarea
                id="email-message"
                name="message"
                rows={5}
                className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-vertical"
                placeholder="Tell us how we can help you..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
            >
              Send Email
            </button>
          </form>
        </section>

        {/* Divider */}
        <div className="border-t border-zinc-700"></div>

        {/* Request Callback Form */}
        <section className="bg-zinc-800 rounded-lg p-8 border border-zinc-700">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">Request a Call Back</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="callback-name" className="block text-sm font-medium text-zinc-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="callback-name"
                name="name"
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
                name="phone"
                className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label htmlFor="callback-time" className="block text-sm font-medium text-zinc-300 mb-2">
                Preferred Time <span className="text-zinc-500">(Optional)</span>
              </label>
              <input
                type="text"
                id="callback-time"
                name="preferredTime"
                className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                placeholder="e.g., Weekdays 10 AM - 2 PM"
              />
            </div>

            <div>
              <label htmlFor="callback-message" className="block text-sm font-medium text-zinc-300 mb-2">
                Message
              </label>
              <textarea
                id="callback-message"
                name="message"
                rows={4}
                className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-vertical"
                placeholder="Brief description of your inquiry..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
            >
              Request Callback
            </button>
          </form>
        </section>

        {/* Footer Note */}
        <div className="text-center text-zinc-400 text-sm">
          <p>
            💡 For emergency assistance, please use our{' '}
            <span className="text-red-400 font-medium">SOS feature</span> in the main app.
          </p>
          <p className="mt-2">
            We typically respond to support requests within 24 hours.
          </p>
        </div>

      </div>
    </div>
  )
}