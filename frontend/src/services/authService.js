import apiClient from '../utils/apiClient'

/**
 * Authentication service for handling user authentication operations
 */
const authService = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and tokens
   */
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password })
    
    // Store tokens in local storage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('refreshToken', response.data.refreshToken)
    
    return response.data
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Created user data
   */
  register: async (userData) => {
    const formData = new FormData()
    
    // Add user data to form data
    Object.keys(userData).forEach(key => {
      if (key === 'profilePhoto' && userData[key] instanceof File) {
        formData.append(key, userData[key])
      } else if (key === 'academicCalendar' && userData[key] instanceof File) {
        formData.append(key, userData[key])
      } else {
        formData.append(key, userData[key])
      }
    })
    
    const response = await apiClient.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  },
  
  /**
   * Logout the current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Remove tokens from local storage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - Whether user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
  
  /**
   * Get current user data
   * @returns {Promise<Object>} - User data
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
  
  /**
   * Refresh authentication token
   * @returns {Promise<Object>} - New tokens
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await apiClient.post('/auth/refresh-token', { refreshToken })
    
    // Update tokens in local storage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('refreshToken', response.data.refreshToken)
    
    return response.data
  },
  
  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} - Response data
   */
  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email })
    return response.data
  },
  
  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise<Object>} - Response data
   */
  resetPassword: async (token, password) => {
    const response = await apiClient.post('/auth/reset-password', { token, password })
    return response.data
  },
  
  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Response data
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.post('/auth/change-password', { 
      currentPassword, 
      newPassword 
    })
    return response.data
  }
}

export default authService