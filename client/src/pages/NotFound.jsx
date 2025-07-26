import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleGoHome = () => {
    navigate('/')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-black text-white overflow-hidden relative">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Mouse Following Gradient */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.1), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Main 404 Text */}
          <motion.div variants={itemVariants}>
            <motion.h1 
              className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-8"
              variants={floatingVariants}
              animate="animate"
            >
              404
            </motion.h1>
          </motion.div>

          {/* Lost Car Animation */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{
                x: [-20, 20, -20],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🚗💨
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! You've taken a wrong turn!
            </h2>
            <p className="text-xl text-zinc-300 mb-2">
              The page you're looking for seems to have gone on a ride without you.
            </p>
            <p className="text-lg text-zinc-400">
              Don't worry, we'll help you get back on track! 🛣️
            </p>
          </motion.div>

          {/* Interactive Elements */}
          <motion.div
            variants={itemVariants}
            className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl border border-zinc-700 hover:border-purple-500 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="text-lg font-semibold text-white mb-2">Go Home</h3>
              <p className="text-zinc-400 text-sm">Return to the main page</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl border border-zinc-700 hover:border-blue-500 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-white mb-2">Search Rides</h3>
              <p className="text-zinc-400 text-sm">Find available rides</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl border border-zinc-700 hover:border-green-500 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-3xl mb-3">🛟</div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Help</h3>
              <p className="text-zinc-400 text-sm">Visit our support center</p>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform transition-all duration-300"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="flex items-center gap-2">
                🏠 Back to Home
                <motion.span
                  animate={{ x: isHovering ? 5 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>

            <Link to="/search">
              <motion.button
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-zinc-600 hover:border-zinc-500 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔍 Search Rides
              </motion.button>
            </Link>
          </motion.div>

          {/* Emergency Button */}
          <motion.div
            variants={itemVariants}
            className="mt-8"
          >
            <Link to="/sos">
              <motion.button
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 30px rgba(239, 68, 68, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                🚨 Emergency SOS
              </motion.button>
            </Link>
          </motion.div>

          {/* Fun Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          >
            <div className="bg-zinc-800 bg-opacity-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">10K+</div>
              <div className="text-sm text-zinc-400">Safe Rides</div>
            </div>
            <div className="bg-zinc-800 bg-opacity-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">5K+</div>
              <div className="text-sm text-zinc-400">Happy Users</div>
            </div>
            <div className="bg-zinc-800 bg-opacity-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">PAN</div>
              <div className="text-sm text-zinc-400">India Coverage</div>
            </div>
            <div className="bg-zinc-800 bg-opacity-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-zinc-400">Support</div>
            </div>
          </motion.div>

          {/* Footer Message */}
          <motion.div
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <p className="text-zinc-500 text-sm">
              🌟 Don't worry, even the best drivers take wrong turns sometimes!
            </p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}