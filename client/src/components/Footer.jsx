import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const handleLinkClick = (path) => {
    if (path.includes('#')) {
      const [route, hash] = path.split('#')
      if (window.location.pathname === route) {
        // Same page, just scroll to section
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        // Different page, navigate and then scroll
        window.location.href = path
      }
    }
  }

  const quickLinks = [
    { name: "Find Rides", path: "/", icon: "🚗" },
    { name: "Post Ride", path: "/post", icon: "📍" },
    { name: "Search Rides", path: "/search", icon: "🔍" },
    { name: "Profile", path: "/profile", icon: "👤" }
  ]

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy", icon: "🔒" },
    { name: "Terms of Service", path: "/terms", icon: "📜" },
    { name: "Refund Policy", path: "/refund", icon: "💸" },
    { name: "About Us", path: "/about", icon: "ℹ️" }
  ]

  const emergencyLinks = [
    { name: "Emergency SOS", path: "/sos", icon: "🚨" },
    { name: "Safety Center", path: "/about#safety", icon: "🛡️" },
    { name: "Emergency Contacts", path: "/sos", icon: "📞" }
  ]

  const socialLinks = [
    { name: "Support", url: "mailto:support@ride-along.xyz", icon: "📧" },
    { name: "Feedback", url: "mailto:support@ride-along.xyz", icon: "💬" }
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-1"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center mb-4">
              <img 
                src="/logo.png" 
                alt="Ride Along Logo" 
                className="h-10 w-10 mr-3 rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              <div 
                className="h-10 w-10 mr-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg hidden"
              >
                R
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-400">Ride Along</h3>
                <p className="text-gray-400 text-sm">Smart Ride Sharing</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Revolutionizing urban transportation through smart ride-sharing technology. 
              Safe, efficient, and community-driven mobility solutions.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-xs">🌱 Eco-Friendly</span>
              <span className="bg-green-900 text-green-200 px-3 py-1 rounded-full text-xs">🚨 Safety First</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-purple-400 transition duration-200 flex items-center group"
                  >
                    <span className="mr-2 group-hover:scale-110 transition-transform duration-200">
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal & Policies */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Legal & Support</h4>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-purple-400 transition duration-200 flex items-center group"
                  >
                    <span className="mr-2 group-hover:scale-110 transition-transform duration-200">
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Emergency & Safety */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-red-400">Emergency & Safety</h4>
            <ul className="space-y-2 mb-4">
              {emergencyLinks.map((link, index) => (
                <li key={index}>
                  {link.path.includes('#') ? (
                    <button
                      onClick={() => handleLinkClick(link.path)}
                      className="text-gray-300 hover:text-red-400 transition duration-200 flex items-center group w-full text-left"
                    >
                      <span className="mr-2 group-hover:scale-110 transition-transform duration-200">
                        {link.icon}
                      </span>
                      {link.name}
                    </button>
                  ) : (
                    <Link 
                      to={link.path}
                      className="text-gray-300 hover:text-red-400 transition duration-200 flex items-center group"
                    >
                      <span className="mr-2 group-hover:scale-110 transition-transform duration-200">
                        {link.icon}
                      </span>
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="bg-red-900 bg-opacity-50 p-3 rounded-lg border border-red-800">
              <p className="text-red-200 text-sm mb-2">
                <strong>🚨 Emergency Numbers:</strong>
              </p>
              <p className="text-red-300 text-xs">
                • 112 - Emergency Services<br/>
                • 1033 - Roadside Assistance
              </p>
            </div>
          </motion.div>
        </div>

        {/* Contact & Social Section */}
        <motion.div 
          className="border-t border-gray-800 mt-8 pt-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Contact & Support</h4>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <span className="mr-3 text-xl">📧</span>
                  <div>
                    <p className="font-medium">Email Support</p>
                    <a 
                      href="mailto:support@ride-along.xyz" 
                      className="text-purple-400 hover:text-purple-300 transition duration-200"
                    >
                      support@ride-along.xyz
                    </a>
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="mr-3 text-xl">💬</span>
                  <div>
                    <p className="font-medium">Get Help</p>
                    <a 
                      href="mailto:support@ride-along.xyz" 
                      className="text-purple-400 hover:text-purple-300 transition duration-200"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="mr-3 text-xl">🌍</span>
                  <div>
                    <p className="font-medium">Service Area</p>
                    <p className="text-gray-400">Uttar Pradesh Coverage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* App Features Highlight */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Platform Features</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-2xl mb-1">⚡</div>
                  <p className="text-sm font-medium text-gray-200">98% Faster</p>
                  <p className="text-xs text-gray-400">Load Performance</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🔐</div>
                  <p className="text-sm font-medium text-gray-200">Secure Auth</p>
                  <p className="text-xs text-gray-400">Firebase Protected</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-2xl mb-1">📱</div>
                  <p className="text-sm font-medium text-gray-200">Mobile Ready</p>
                  <p className="text-xs text-gray-400">Responsive Design</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🗺️</div>
                  <p className="text-sm font-medium text-gray-200">Live Maps</p>
                  <p className="text-xs text-gray-400">Real-time Tracking</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          className="border-t border-gray-800 mt-8 pt-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target={social.url.startsWith('http') ? '_blank' : '_self'}
                rel={social.url.startsWith('http') ? 'noopener noreferrer' : ''}
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition duration-200 flex items-center space-x-2 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                  {social.icon}
                </span>
                <span className="text-gray-300 group-hover:text-white transition duration-200">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div 
        className="bg-gray-950 py-4"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-2 md:mb-0">
              <p>© {currentYear} Ride Along. All rights reserved.</p>
              <p className="text-xs mt-1">
                Built with ❤️ for safe and efficient ride-sharing
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                <span>Service Status: In Development</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Emergency Floating Button (Mobile) */}
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <Link
          to="/sos"
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition duration-200 flex items-center justify-center"
        >
          <span className="text-xl">🚨</span>
        </Link>
      </div>
    </footer>
  )
}// Trigger Vercel redeploy for footer fix - Wed Jul 23 02:14:33 PM UTC 2025
