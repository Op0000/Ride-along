import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
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

    return () => unsub()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
  
