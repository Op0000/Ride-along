import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function About() {
  useEffect(() => {
    // Handle hash navigation on page load
    const hash = window.location.hash.substring(1)
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const teamMembers = [
    {
      name: "Smart Technology",
      role: "AI-Powered Matching",
      description: "Advanced algorithms ensure optimal ride matching",
      icon: "🤖"
    },
    {
      name: "Safety First",
      role: "Emergency Features",
      description: "SOS system with live location sharing for security",
      icon: "🛡️"
    },
    {
      name: "User Experience",
      role: "Intuitive Design", 
      description: "Clean, modern interface for seamless ride sharing",
      icon: "✨"
    }
  ]

  const features = [
    {
      icon: "🚗",
      title: "Smart Ride Matching",
      description: "Our intelligent system matches drivers and passengers based on routes, preferences, and timing for optimal ride-sharing experiences."
    },
    {
      icon: "🗺️",
      title: "Interactive Maps",
      description: "Real-time mapping with precise location tracking, route visualization, and turn-by-turn navigation integration."
    },
    {
      icon: "🚨",
      title: "Emergency Safety",
      description: "Comprehensive SOS system with live location sharing, emergency contacts, and direct access to emergency services."
    },
    {
      icon: "📧",
      title: "Smart Notifications",
      description: "Automated email confirmations, booking updates, and driver-passenger communication through professional templates."
    },
    {
      icon: "🔐",
      title: "Secure Authentication",
      description: "Firebase-powered secure login with Google integration, ensuring your data is protected and easily accessible."
    },
    {
      icon: "⚡",
      title: "Fast Performance",
      description: "Optimized with 98% bundle size reduction, lazy loading, and modern web technologies for lightning-fast experience."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Safe Rides Completed", icon: "🚗" },
    { number: "5,000+", label: "Happy Users", icon: "😊" },
    { number: "50+", label: "Cities Covered", icon: "🌍" },
    { number: "24/7", label: "Emergency Support", icon: "🚨" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Ride Along 🚗
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Revolutionizing urban transportation through smart ride-sharing technology, 
              connecting people safely and efficiently across the city.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/sos"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
              >
                🚨 Emergency SOS
              </Link>
              <Link 
                to="/"
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-semibold transition duration-200"
              >
                🏠 Find Rides
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        id="mission"
        className="py-16"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 mb-6">
                At Ride Along, we believe transportation should be accessible, safe, and sustainable. 
                Our platform connects drivers and passengers heading in the same direction, reducing 
                traffic congestion, carbon emissions, and travel costs.
              </p>
                              <p className="text-lg text-gray-300 mb-6">
                We're not just about getting from point A to point B – we're about building communities, 
                fostering connections, and making every journey safer with our advanced emergency features.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="bg-blue-900 text-blue-300 px-4 py-2 rounded-full font-medium">🌱 Eco-Friendly</span>
                <span className="bg-green-900 text-green-300 px-4 py-2 rounded-full font-medium">💰 Cost-Effective</span>
                <span className="bg-purple-900 text-purple-300 px-4 py-2 rounded-full font-medium">🤝 Community-Driven</span>
              </div>
            </motion.div>
            <motion.div 
              id="safety"
              variants={fadeInUp}
              className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Why Choose Ride Along?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <strong>Safety First:</strong> Emergency SOS system with live location sharing
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <strong>Smart Matching:</strong> AI-powered algorithm for optimal ride pairing
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <strong>Real-time Updates:</strong> Live tracking and instant notifications
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <strong>User-Friendly:</strong> Modern, intuitive interface for all ages
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

              {/* Stats Section */}
        <motion.section 
          id="impact"
          className="py-16 bg-gray-800"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-xl text-gray-300">Making a difference in urban transportation</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="text-center bg-gradient-to-br from-gray-700 to-gray-600 p-6 rounded-xl border border-gray-600"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                                  <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

              {/* Features Section */}
        <motion.section 
          id="features"
          className="py-16"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-xl text-gray-300">Cutting-edge technology for seamless ride-sharing</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

              {/* Technology Section */}
        <motion.section 
          id="technology"
          className="py-16 bg-gray-900 text-white"
        variants={staggerContainer}
        initial="initial" 
        animate="animate"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-xl text-gray-300">Powered by cutting-edge tech stack for optimal performance</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-gray-800 p-6 rounded-xl text-center"
              >
                <div className="text-5xl mb-4">{member.icon}</div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-300">{member.description}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-6">Tech Stack</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-blue-600 px-4 py-2 rounded-full">React 18</span>
              <span className="bg-green-600 px-4 py-2 rounded-full">Node.js</span>
              <span className="bg-purple-600 px-4 py-2 rounded-full">MongoDB</span>
              <span className="bg-orange-600 px-4 py-2 rounded-full">Firebase</span>
              <span className="bg-red-600 px-4 py-2 rounded-full">Vite</span>
              <span className="bg-indigo-600 px-4 py-2 rounded-full">Tailwind CSS</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

              {/* Contact Section */}
        <motion.section 
          id="contact"
          className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold mb-6">Get Started Today</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who are already saving money and making new connections
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/"
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-semibold transition duration-200"
              >
                🚗 Start Ride Sharing
              </Link>
              <Link 
                to="/post"
                className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
              >
                📍 Post a Ride
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer CTA */}
      <motion.section 
        className="py-12 bg-gray-800 text-white"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Questions or Need Help?</h3>
          <p className="text-gray-300 mb-6">
            Our support team is here to help you with any questions about ride sharing or emergency features.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/sos"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              🚨 Emergency SOS
            </Link>
            <Link 
              to="/privacy"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              🔒 Privacy Policy
            </Link>
            <Link 
              to="/terms"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              📜 Terms of Service
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}