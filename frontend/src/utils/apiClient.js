import axios from 'axios'
import { createErrorObject, getUserFriendlyMessage, isAuthError } from './apiErrorHandler'
import { showError } from '../components/common/ToastNotification'

/**
 * API client for making HTTP requests
 * 
 * This module provides a configured Axios instance for making API requests
 * with common configuration and interceptors.
 */

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Default request timeout
const DEFAULT_TIMEOUT = 30000 // 30 seconds

// Maximum number of retry attempts
const MAX_RETRY_ATTEMPTS = 3

// Retry delay in milliseconds (with exponential backoff)
const RETRY_DELAY = 1000

// Create Axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

/**
 * Request logger for debugging
 */
const logRequest = (config) => {
  if (import.meta.env.DEV) {
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
      headers: config.headers
    })
  }
  return config
}

/**
 * Response logger for debugging
 */
const logResponse = (response) => {
  if (import.meta.env.DEV) {
    console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    })
  }
  return response
}

/**
 * Error logger for debugging
 */
const logError = (error) => {
  if (import.meta.env.DEV) {
    const errorObj = createErrorObject(error)
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase() || 'UNKNOWN'} ${error.config?.url || 'UNKNOWN'}`, errorObj)
  }
  return Promise.reject(error)
}

/**
 * Add authentication token to request
 */
const addAuthToken = (config) => {
  // Get token from local storage
  const token = localStorage.getItem('token')
  
  // Add token to headers if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
}

/**
 * Add request metadata
 */
const addRequestMetadata = (config) => {
  // Add timestamp to request
  config.metadata = {
    ...config.metadata,
    startTime: new Date().getTime()
  }
  
  // Add request ID
  config.requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  
  return config
}

/**
 * Add response metadata
 */
const addResponseMetadata = (response) => {
  const { config } = response
  
  // Calculate request duration
  if (config.metadata?.startTime) {
    const endTime = new Date().getTime()
    const duration = endTime - config.metadata.startTime
    
    response.metadata = {
      ...response.metadata,
      duration
    }
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`⚠️ Slow API request: ${config.method.toUpperCase()} ${config.url} took ${duration}ms`)
    }
  }
  
  return response
}

/**
 * Handle token refresh
 */
const handleTokenRefresh = async (error) => {
  const originalRequest = error.config
  
  // Only handle 401 errors and avoid infinite retry loops
  if (!isAuthError(error) || originalRequest._retry) {
    return Promise.reject(error)
  }
  
  originalRequest._retry = true
  
  try {
    // Try to refresh token
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    // Call refresh token endpoint
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken
    })
    
    // Update tokens in local storage
    const { token, refreshToken: newRefreshToken } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', newRefreshToken)
    
    // Update authorization header
    originalRequest.headers.Authorization = `Bearer ${token}`
    
    // Retry the original request
    return apiClient(originalRequest)
  } catch (refreshError) {
    // If refresh token fails, log out user
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    
    // Show error notification
    showError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.')
    
    // Redirect to login page
    window.location.href = '/login'
    
    return Promise.reject(refreshError)
  }
}

/**
 * Handle request retry for network errors
 */
const handleRequestRetry = async (error) => {
  const { config } = error
  
  // Only retry on network errors or 5xx server errors
  if (!error.code || 
      (error.response && (error.response.status < 500 || error.response.status >= 600)) ||
      !config) {
    return Promise.reject(error)
  }
  
  // Initialize retry count
  config.retryCount = config.retryCount || 0
  
  // Check if max retries reached
  if (config.retryCount >= MAX_RETRY_ATTEMPTS) {
    return Promise.reject(error)
  }
  
  // Increment retry count
  config.retryCount += 1
  
  // Calculate delay with exponential backoff
  const delay = RETRY_DELAY * Math.pow(2, config.retryCount - 1)
  
  // Log retry attempt
  console.log(`🔄 Retrying request (${config.retryCount}/${MAX_RETRY_ATTEMPTS}): ${config.method.toUpperCase()} ${config.url} after ${delay}ms`)
  
  // Wait before retrying
  await new Promise(resolve => setTimeout(resolve, delay))
  
  // Retry request
  return apiClient(config)
}

/**
 * Handle API errors
 */
const handleApiError = (error) => {
  // Create standardized error object
  const errorObj = createErrorObject(error)
  
  // Add error to error tracking system (if available)
  // errorTracker.captureError(errorObj)
  
  // Return rejected promise with original error
  return Promise.reject(error)
}

// Request interceptors
apiClient.interceptors.request.use(logRequest)
apiClient.interceptors.request.use(addAuthToken)
apiClient.interceptors.request.use(addRequestMetadata)

// Response interceptors
apiClient.interceptors.response.use(logResponse, logError)
apiClient.interceptors.response.use(addResponseMetadata, error => Promise.reject(error))
apiClient.interceptors.response.use(response => response, handleTokenRefresh)
apiClient.interceptors.response.use(response => response, handleRequestRetry)
apiClient.interceptors.response.use(response => response, handleApiError)

/**
 * Make API request with automatic error handling
 * @param {Object} config - Axios request config
 * @param {Object} options - Additional options
 * @returns {Promise} - API response
 */
export const apiRequest = async (config, options = {}) => {
  const {
    showErrorNotification = true,
    transformResponse = data => data,
    onError = null
  } = options
  
  try {
    const response = await apiClient(config)
    return transformResponse(response.data)
  } catch (error) {
    // Handle error
    if (showErrorNotification) {
      const message = getUserFriendlyMessage(error)
      showError(message)
    }
    
    // Call custom error handler
    if (onError) {
      onError(error)
    }
    
    throw error
  }
}

export default apiClient