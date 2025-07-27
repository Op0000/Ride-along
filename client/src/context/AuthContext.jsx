import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set a timeout to ensure loading doesn't stay true forever
    const timeout = setTimeout(() => {
      console.warn('Auth timeout - setting loading to false')
      setLoading(false)
    }, 5000) // 5 second timeout

    try {
      const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        clearTimeout(timeout) // Clear timeout since auth state changed
        
        if (firebaseUser) {
          try {
            // Get the Firebase ID token
            const token = await firebaseUser.getIdToken()
            
            // Store in localStorage for your booking system
            localStorage.setItem('uid', firebaseUser.uid)
            localStorage.setItem('token', token)
            
            setUser(firebaseUser)
          } catch (error) {
            console.error('Error getting ID token:', error)
            setUser(firebaseUser)
          }
        } else {
          // Clear localStorage when user logs out
          localStorage.removeItem('uid')
          localStorage.removeItem('token')
          setUser(null)
        }
        setLoading(false)
      })

      return () => {
        clearTimeout(timeout)
        unsub()
      }
    } catch (error) {
      console.error('Error setting up auth listener:', error)
      clearTimeout(timeout)
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
  
