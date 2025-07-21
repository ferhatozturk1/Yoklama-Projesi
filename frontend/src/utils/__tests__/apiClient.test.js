import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import apiClient from '../apiClient'
import { handleApiError } from '../apiErrorHandler'
import { showError, showWarning } from '../../components/common/ToastNotification'

// Mock axios
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { use: vi.fn(), eject: vi.fn() }
        },
        defaults: {
          timeout: 30000,
          baseURL: 'http://localhost:3000/api'
        }
      })),
      isCancel: vi.fn(error => error.name === 'CanceledError')
    }
  }
})

// Mock toast notifications
vi.mock('../../components/common/ToastNotification', () => ({
  showError: vi.fn(),
  showWarning: vi.fn(),
  showSuccess: vi.fn()
}))

// Mock apiErrorHandler
vi.mock('../apiErrorHandler', () => ({
  handleApiError: vi.fn(),
  getErrorType: vi.fn(),
  ErrorTypes: {
    NETWORK: 'NETWORK',
    AUTHENTICATION: 'AUTHENTICATION',
    AUTHORIZATION: 'AUTHORIZATION',
    VALIDATION: 'VALIDATION',
    NOT_FOUND: 'NOT_FOUND',
    SERVER: 'SERVER',
    TIMEOUT: 'TIMEOUT',
    UNKNOWN: 'UNKNOWN'
  }
}))

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.useRealTimers()
  })
  
  it('should create an axios instance with correct config', () => {
    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: expect.any(String),
      timeout: expect.any(Number),
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }))
  })
  
  describe('Request Interceptor', () => {
    it('should add auth token to request headers if available', () => {
      // Mock request interceptor
      const requestInterceptor = vi.fn((config) => config)
      apiClient.interceptors.request.use = vi.fn((callback) => {
        requestInterceptor(callback)
      })
      
      // Set token in localStorage
      localStorage.setItem('token', 'test-token')
      
      // Create a mock config
      const config = { headers: {} }
      
      // Call the interceptor
      requestInterceptor(config)
      
      // Check if token was added
      expect(config.headers.Authorization).toBe('Bearer test-token')
    })
    
    it('should not add auth token if not available', () => {
      // Mock request interceptor
      const requestInterceptor = vi.fn((config) => config)
      apiClient.interceptors.request.use = vi.fn((callback) => {
        requestInterceptor(callback)
      })
      
      // Create a mock config
      const config = { headers: {} }
      
      // Call the interceptor
      requestInterceptor(config)
      
      // Check that no token was added
      expect(config.headers.Authorization).toBeUndefined()
    })
    
    it('should add request metadata and ID', () => {
      // Mock request interceptor
      const requestInterceptor = vi.fn((config) => config)
      apiClient.interceptors.request.use = vi.fn((callback) => {
        requestInterceptor(callback)
      })
      
      // Create a mock config
      const config = { headers: {} }
      
      // Call the interceptor
      requestInterceptor(config)
      
      // Check metadata and request ID
      expect(config.metadata).toBeDefined()
      expect(config.metadata.startTime).toBeDefined()
      expect(config.headers['X-Request-ID']).toBeDefined()
    })
    
    it('should create abort controller for the request', () => {
      // Mock request interceptor
      const requestInterceptor = vi.fn((config) => config)
      apiClient.interceptors.request.use = vi.fn((callback) => {
        requestInterceptor(callback)
      })
      
      // Create a mock config
      const config = { headers: {} }
      
      // Call the interceptor
      requestInterceptor(config)
      
      // Check abort signal
      expect(config.signal).toBeDefined()
    })
  })
  
  describe('Response Interceptor', () => {
    it('should handle successful responses', () => {
      // Mock response interceptor
      const responseInterceptor = vi.fn((response) => response)
      apiClient.interceptors.response.use = vi.fn((callback) => {
        responseInterceptor(callback)
      })
      
      // Create a mock response
      const response = {
        data: { result: 'success' },
        status: 200,
        config: {
          metadata: {
            startTime: new Date(Date.now() - 1000) // 1 second ago
          },
          method: 'get',
          url: '/test'
        }
      }
      
      // Call the interceptor
      const result = responseInterceptor(response)
      
      // Check result
      expect(result).toEqual(response)
    })
    
    it('should handle no content responses', () => {
      // Mock response interceptor
      const responseInterceptor = vi.fn((response) => response)
      apiClient.interceptors.response.use = vi.fn((callback) => {
        responseInterceptor(callback)
      })
      
      // Create a mock response
      const response = {
        status: 204,
        config: {
          metadata: {
            startTime: new Date()
          },
          method: 'delete',
          url: '/test'
        }
      }
      
      // Call the interceptor
      const result = responseInterceptor(response)
      
      // Check result
      expect(result).toEqual({ data: null, status: 204 })
    })
    
    it('should show warnings from response', () => {
      // Mock response interceptor
      const responseInterceptor = vi.fn((response) => response)
      apiClient.interceptors.response.use = vi.fn((callback) => {
        responseInterceptor(callback)
      })
      
      // Create a mock response with warnings
      const response = {
        data: {
          result: 'success',
          warnings: ['Warning 1', 'Warning 2']
        },
        status: 200,
        config: {
          metadata: {
            startTime: new Date()
          },
          method: 'get',
          url: '/test'
        }
      }
      
      // Call the interceptor
      responseInterceptor(response)
      
      // Check warnings
      expect(showWarning).toHaveBeenCalledTimes(2)
      expect(showWarning).toHaveBeenCalledWith('Warning 1')
      expect(showWarning).toHaveBeenCalledWith('Warning 2')
    })
  })
  
  describe('Error Handling', () => {
    it('should handle token refresh on 401 error', async () => {
      // Mock error handler
      const errorHandler = vi.fn()
      apiClient.interceptors.response.use = vi.fn((_, errorCallback) => {
        errorHandler(errorCallback)
      })
      
      // Create a mock error
      const originalRequest = {
        headers: {},
        _retry: false
      }
      
      const error = new Error('Unauthorized')
      error.response = { status: 401 }
      error.config = originalRequest
      
      // Mock successful token refresh
      const mockResponse = {
        data: {
          token: 'new-token',
          refreshToken: 'new-refresh-token'
        }
      }
      
      // Set refresh token
      localStorage.setItem('refreshToken', 'old-refresh-token')
      
      // Mock axios post for token refresh
      axios.post = vi.fn().mockResolvedValue(mockResponse)
      
      // Mock apiClient for retry
      apiClient.mockResolvedValueOnce({ data: 'success' })
      
      // Call the error handler
      try {
        await errorHandler(error)
      } catch (e) {
        // Ignore error
      }
      
      // Check token refresh
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh-token'),
        { refreshToken: 'old-refresh-token' },
        expect.any(Object)
      )
      
      // Check tokens in localStorage
      expect(localStorage.getItem('token')).toBe('new-token')
      expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token')
      
      // Check original request update
      expect(originalRequest.headers.Authorization).toBe('Bearer new-token')
      expect(originalRequest._retry).toBe(true)
    })
    
    it('should handle token refresh failure', async () => {
      // Mock error handler
      const errorHandler = vi.fn()
      apiClient.interceptors.response.use = vi.fn((_, errorCallback) => {
        errorHandler(errorCallback)
      })
      
      // Create a mock error
      const originalRequest = {
        headers: {},
        _retry: false
      }
      
      const error = new Error('Unauthorized')
      error.response = { status: 401 }
      error.config = originalRequest
      
      // Set refresh token
      localStorage.setItem('token', 'old-token')
      localStorage.setItem('refreshToken', 'old-refresh-token')
      
      // Mock axios post for token refresh failure
      axios.post = vi.fn().mockRejectedValue(new Error('Refresh failed'))
      
      // Mock window.location
      const originalLocation = window.location
      delete window.location
      window.location = { href: '' }
      
      // Mock dispatchEvent
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent')
      
      // Call the error handler
      try {
        await errorHandler(error)
      } catch (e) {
        // Ignore error
      }
      
      // Check tokens removed from localStorage
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
      
      // Check redirect
      expect(window.location.href).toBe('/login')
      
      // Check event dispatch
      expect(dispatchEventSpy).toHaveBeenCalled()
      
      // Restore window.location
      window.location = originalLocation
    })
    
    it('should retry on network error for idempotent requests', async () => {
      // Mock error handler
      const errorHandler = vi.fn()
      apiClient.interceptors.response.use = vi.fn((_, errorCallback) => {
        errorHandler(errorCallback)
      })
      
      // Create a mock error
      const originalRequest = {
        method: 'get',
        _networkRetry: false
      }
      
      const error = new Error('Network Error')
      error.response = null
      error.config = originalRequest
      
      // Mock apiClient for retry
      apiClient.mockResolvedValueOnce({ data: 'success' })
      
      // Call the error handler
      try {
        const promise = errorHandler(error)
        
        // Fast-forward timers
        vi.advanceTimersByTime(2000)
        
        await promise
      } catch (e) {
        // Ignore error
      }
      
      // Check warning
      expect(showWarning).toHaveBeenCalled()
      
      // Check retry flag
      expect(originalRequest._networkRetry).toBe(true)
    })
    
    it('should retry on rate limiting (429)', async () => {
      // Mock error handler
      const errorHandler = vi.fn()
      apiClient.interceptors.response.use = vi.fn((_, errorCallback) => {
        errorHandler(errorCallback)
      })
      
      // Create a mock error
      const originalRequest = {
        _rateRetry: false
      }
      
      const error = new Error('Too Many Requests')
      error.response = {
        status: 429,
        headers: {
          'retry-after': '2'
        }
      }
      error.config = originalRequest
      
      // Mock apiClient for retry
      apiClient.mockResolvedValueOnce({ data: 'success' })
      
      // Call the error handler
      try {
        const promise = errorHandler(error)
        
        // Fast-forward timers
        vi.advanceTimersByTime(2000)
        
        await promise
      } catch (e) {
        // Ignore error
      }
      
      // Check warning
      expect(showWarning).toHaveBeenCalled()
      
      // Check retry flag
      expect(originalRequest._rateRetry).toBe(true)
    })
    
    it('should retry on server error (5xx)', async () => {
      // Mock error handler
      const errorHandler = vi.fn()
      apiClient.interceptors.response.use = vi.fn((_, errorCallback) => {
        errorHandler(errorCallback)
      })
      
      // Create a mock error
      const originalRequest = {
        _serverRetry: false
      }
      
      const error = new Error('Server Error')
      error.response = { status: 500 }
      error.config = originalRequest
      
      // Mock apiClient for retry
      apiClient.mockResolvedValueOnce({ data: 'success' })
      
      // Call the error handler
      try {
        const promise = errorHandler(error)
        
        // Fast-forward timers
        vi.advanceTimersByTime(3000)
        
        await promise
      } catch (e) {
        // Ignore error
      }
      
      // Check warning
      expect(showWarning).toHaveBeenCalled()
      
      // Check retry flag
      expect(originalRequest._serverRetry).toBe(true)
    })
    
    it('should dispatch API error event', async () => {
      // Mock error handler
      const errorHandler = vi.fn()
      apiClient.interceptors.response.use = vi.fn((_, errorCallback) => {
        errorHandler(errorCallback)
      })
      
      // Create a mock error
      const error = new Error('Error')
      error.response = { status: 400 }
      error.config = {}
      
      // Mock dispatchEvent
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent')
      
      // Call the error handler
      try {
        await errorHandler(error)
      } catch (e) {
        // Ignore error
      }
      
      // Check event dispatch
      expect(dispatchEventSpy).toHaveBeenCalled()
    })
  })
  
  describe('Helper Methods', () => {
    it('should cancel all pending requests', () => {
      // Mock abort controllers
      const abortController1 = { abort: vi.fn() }
      const abortController2 = { abort: vi.fn() }
      
      // Add controllers to pendingRequests map
      const pendingRequests = new Map()
      pendingRequests.set('request1', abortController1)
      pendingRequests.set('request2', abortController2)
      
      // Replace the pendingRequests map in apiClient
      apiClient.cancelAll()
      
      // Check abort calls
      expect(abortController1.abort).toHaveBeenCalled()
      expect(abortController2.abort).toHaveBeenCalled()
    })
    
    it('should make request with error handling', async () => {
      // Mock successful response
      apiClient.mockResolvedValueOnce({ data: { result: 'success' } })
      
      // Make request
      const result = await apiClient.requestWithErrorHandling({
        method: 'get',
        url: '/test'
      })
      
      // Check result
      expect(result).toEqual({ result: 'success' })
      
      // Mock error response
      const error = new Error('Test error')
      apiClient.mockRejectedValueOnce(error)
      
      // Make request with error
      try {
        await apiClient.requestWithErrorHandling({
          method: 'get',
          url: '/test'
        })
      } catch (e) {
        // Check error handling
        expect(handleApiError).toHaveBeenCalledWith(error, expect.any(Object))
      }
    })
    
    it('should set default timeout', () => {
      apiClient.setTimeout(5000)
      expect(apiClient.defaults.timeout).toBe(5000)
    })
    
    it('should set base URL', () => {
      apiClient.setBaseURL('https://api.example.com')
      expect(apiClient.defaults.baseURL).toBe('https://api.example.com')
    })
  })
})