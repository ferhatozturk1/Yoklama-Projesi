import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          // Demo mode - simulate token verification
          if (import.meta.env.VITE_NODE_ENV === 'development' && token.startsWith('demo-jwt-token')) {
            const userData = {
              id: '1',
              email: 'demo@example.com',
              firstName: 'Demo',
              lastName: 'Kullanıcı',
              title: 'Dr.',
              university: 'Demo Üniversitesi',
              faculty: 'Demo Fakültesi',
              department: 'Demo Bölümü',
              profilePhoto: null,
              createdAt: new Date().toISOString()
            }
            setUser(userData)
          } else {
            // Production mode - verify token with API
            const userData = await authService.verifyToken(token)
            setUser(userData)
          }
        }
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('token')
        console.error('Token verification failed:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      
      // Demo mode - simulate API call
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Basic validation
        if (!email || !password) {
          return { 
            success: false, 
            error: 'E-posta ve şifre gereklidir' 
          }
        }
        
        if (!email.includes('@')) {
          return { 
            success: false, 
            error: 'Geçerli bir e-posta adresi giriniz' 
          }
        }
        
        if (password.length < 3) {
          return { 
            success: false, 
            error: 'Şifre en az 3 karakter olmalıdır' 
          }
        }
        
        // Create demo user data
        const userData = {
          id: '1',
          email: email,
          firstName: 'Demo',
          lastName: 'Kullanıcı',
          title: 'Dr.',
          university: 'Demo Üniversitesi',
          faculty: 'Demo Fakültesi',
          department: 'Demo Bölümü',
          profilePhoto: null,
          createdAt: new Date().toISOString()
        }
        
        const token = 'demo-jwt-token-' + Date.now()
        
        // Store token
        localStorage.setItem('token', token)
        setUser(userData)
        
        return { success: true, user: userData }
      }
      
      // Production mode - use real API
      const response = await authService.login(email, password)
      const { user: userData, token } = response
      
      // Store token
      localStorage.setItem('token', token)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Giriş başarısız' 
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      
      // Demo mode - simulate API call
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Basic validation
        if (!userData.email || !userData.password) {
          return { 
            success: false, 
            error: 'E-posta ve şifre gereklidir' 
          }
        }
        
        if (!userData.firstName || !userData.lastName) {
          return { 
            success: false, 
            error: 'Ad ve soyad gereklidir' 
          }
        }
        
        if (!userData.email.includes('@')) {
          return { 
            success: false, 
            error: 'Geçerli bir e-posta adresi giriniz' 
          }
        }
        
        if (userData.password.length < 8) {
          return { 
            success: false, 
            error: 'Şifre en az 8 karakter olmalıdır' 
          }
        }
        
        // Create new user data
        const newUser = {
          id: Date.now().toString(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          title: userData.title || 'Dr.',
          university: userData.university || '',
          faculty: userData.faculty || '',
          department: userData.department || '',
          profilePhoto: null,
          createdAt: new Date().toISOString()
        }
        
        const token = 'demo-jwt-token-' + Date.now()
        
        // Store token
        localStorage.setItem('token', token)
        setUser(newUser)
        
        return { success: true, user: newUser }
      }
      
      // Production mode - use real API
      const response = await authService.register(userData)
      const { user: newUser, token } = response
      
      // Store token
      localStorage.setItem('token', token)
      setUser(newUser)
      
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Kayıt başarısız' 
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    // Optional: Call backend logout endpoint
    authService.logout().catch(console.error)
  }

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }))
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}