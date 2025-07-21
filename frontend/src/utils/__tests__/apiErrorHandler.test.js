import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ErrorTypes,
  getErrorType,
  getErrorMessage,
  getValidationErrors,
  handleApiError,
  withRetry
} from '../apiErrorHandler'
import { showError } from '../../components/common/ToastNotification'

// Mock toast notifications
vi.mock('../../components/common/ToastNotification', () => ({
  showError: vi.fn(),
  showWarning: vi.fn(),
  showSuccess: vi.fn()
}))

describe('API Error Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getErrorType', () => {
    it('should identify network errors', () => {
      const error = new Error('Network Error')
      error.response = null
      
      expect(getErrorType(error)).toBe(ErrorTypes.NETWORK)
    })
    
    it('should identify timeout errors', () => {
      const error = new Error('Timeout')
      error.code = 'ECONNABORTED'
      
      expect(getErrorType(error)).toBe(ErrorTypes.TIMEOUT)
    })
    
    it('should identify authentication errors', () => {
      const error = new Error('Unauthorized')
      error.response = { status: 401 }
      
      expect(getErrorType(error)).toBe(ErrorTypes.AUTHENTICATION)
    })
    
    it('should identify authorization errors', () => {
      const error = new Error('Forbidden')
      error.response = { status: 403 }
      
      expect(getErrorType(error)).toBe(ErrorTypes.AUTHORIZATION)
    })
    
    it('should identify validation errors', () => {
      const error = new Error('Bad Request')
      error.response = { status: 400 }
      
      expect(getErrorType(error)).toBe(ErrorTypes.VALIDATION)
    })
    
    it('should identify not found errors', () => {
      const error = new Error('Not Found')
      error.response = { status: 404 }
      
      expect(getErrorType(error)).toBe(ErrorTypes.NOT_FOUND)
    })
    
    it('should identify server errors', () => {
      const error = new Error('Server Error')
      error.response = { status: 500 }
      
      expect(getErrorType(error)).toBe(ErrorTypes.SERVER)
      
      error.response.status = 502
      expect(getErrorType(error)).toBe(ErrorTypes.SERVER)
      
      error.response.status = 503
      expect(getErrorType(error)).toBe(ErrorTypes.SERVER)
      
      error.response.status = 504
      expect(getErrorType(error)).toBe(ErrorTypes.SERVER)
    })
    
    it('should identify unknown errors', () => {
      const error = new Error('Unknown Error')
      error.response = { status: 418 } // I'm a teapot
      
      expect(getErrorType(error)).toBe(ErrorTypes.UNKNOWN)
    })
  })
  
  describe('getErrorMessage', () => {
    it('should return network error message', () => {
      const error = new Error('Network Error')
      error.response = null
      
      expect(getErrorMessage(error)).toContain('bağlantınızı kontrol edin')
    })
    
    it('should return timeout error message', () => {
      const error = new Error('Timeout')
      error.code = 'ECONNABORTED'
      
      expect(getErrorMessage(error)).toContain('zaman aşımına uğradı')
    })
    
    it('should return authentication error message', () => {
      const error = new Error('Unauthorized')
      error.response = { status: 401 }
      
      expect(getErrorMessage(error)).toContain('Oturum süreniz doldu')
    })
    
    it('should return authorization error message', () => {
      const error = new Error('Forbidden')
      error.response = { status: 403 }
      
      expect(getErrorMessage(error)).toContain('yetkiniz bulunmuyor')
    })
    
    it('should return not found error message', () => {
      const error = new Error('Not Found')
      error.response = { status: 404 }
      
      expect(getErrorMessage(error)).toContain('bulunamadı')
    })
    
    it('should return server error message', () => {
      const error = new Error('Server Error')
      error.response = { status: 500 }
      
      expect(getErrorMessage(error)).toContain('Sunucu hatası')
    })
    
    it('should extract message from response data string', () => {
      const error = new Error('Error')
      error.response = { 
        status: 400,
        data: 'Custom error message'
      }
      
      expect(getErrorMessage(error)).toBe('Geçersiz istek: Custom error message')
    })
    
    it('should extract message from response data object', () => {
      const error = new Error('Error')
      error.response = { 
        status: 400,
        data: { message: 'Custom error message' }
      }
      
      expect(getErrorMessage(error)).toBe('Geçersiz istek: Custom error message')
    })
    
    it('should extract message from response data error field', () => {
      const error = new Error('Error')
      error.response = { 
        status: 400,
        data: { error: 'Custom error message' }
      }
      
      expect(getErrorMessage(error)).toBe('Geçersiz istek: Custom error message')
    })
    
    it('should extract message from response data errors array', () => {
      const error = new Error('Error')
      error.response = { 
        status: 400,
        data: { 
          errors: [
            { message: 'Error 1' },
            { message: 'Error 2' }
          ]
        }
      }
      
      expect(getErrorMessage(error)).toBe('Geçersiz istek: Error 1, Error 2')
    })
  })
  
  describe('getValidationErrors', () => {
    it('should return null for non-validation errors', () => {
      const error = new Error('Not a validation error')
      error.response = { status: 500 }
      
      expect(getValidationErrors(error)).toBeNull()
    })
    
    it('should extract validation errors from errors object', () => {
      const error = new Error('Validation Error')
      error.response = { 
        status: 400,
        data: {
          errors: {
            name: ['Name is required'],
            email: ['Email is invalid']
          }
        }
      }
      
      expect(getValidationErrors(error)).toEqual({
        name: ['Name is required'],
        email: ['Email is invalid']
      })
    })
    
    it('should extract validation errors from validationErrors array', () => {
      const error = new Error('Validation Error')
      error.response = { 
        status: 400,
        data: {
          validationErrors: [
            { field: 'name', message: 'Name is required' },
            { field: 'email', message: 'Email is invalid' }
          ]
        }
      }
      
      const result = getValidationErrors(error)
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('email')
      expect(result.name).toContain('Name is required')
      expect(result.email).toContain('Email is invalid')
    })
    
    it('should extract validation errors from errors array', () => {
      const error = new Error('Validation Error')
      error.response = { 
        status: 400,
        data: {
          errors: [
            { field: 'name', message: 'Name is required' },
            { field: 'email', message: 'Email is invalid' }
          ]
        }
      }
      
      const result = getValidationErrors(error)
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('email')
      expect(result.name).toContain('Name is required')
      expect(result.email).toContain('Email is invalid')
    })
    
    it('should return null if no errors in response', () => {
      const error = new Error('Validation Error')
      error.response = { 
        status: 400,
        data: {}
      }
      
      expect(getValidationErrors(error)).toBeNull()
    })
  })
  
  describe('handleApiError', () => {
    it('should show error notification by default', () => {
      const error = new Error('Test Error')
      error.response = { status: 500 }
      
      handleApiError(error)
      
      expect(showError).toHaveBeenCalled()
    })
    
    it('should not show error notification when disabled', () => {
      const error = new Error('Test Error')
      error.response = { status: 500 }
      
      handleApiError(error, { showNotification: false })
      
      expect(showError).not.toHaveBeenCalled()
    })
    
    it('should call onAuthError for authentication errors', () => {
      const error = new Error('Auth Error')
      error.response = { status: 401 }
      
      const onAuthError = vi.fn()
      
      handleApiError(error, { onAuthError })
      
      expect(onAuthError).toHaveBeenCalledWith(error)
    })
    
    it('should call onValidationError for validation errors', () => {
      const error = new Error('Validation Error')
      error.response = { 
        status: 400,
        data: {
          errors: {
            name: ['Name is required']
          }
        }
      }
      
      const onValidationError = vi.fn()
      
      handleApiError(error, { onValidationError })
      
      expect(onValidationError).toHaveBeenCalled()
      expect(onValidationError.mock.calls[0][0]).toHaveProperty('name')
    })
    
    it('should call onNetworkError for network errors', () => {
      const error = new Error('Network Error')
      error.response = null
      
      const onNetworkError = vi.fn()
      
      handleApiError(error, { onNetworkError })
      
      expect(onNetworkError).toHaveBeenCalledWith(error)
    })
    
    it('should call onServerError for server errors', () => {
      const error = new Error('Server Error')
      error.response = { status: 500 }
      
      const onServerError = vi.fn()
      
      handleApiError(error, { onServerError })
      
      expect(onServerError).toHaveBeenCalledWith(error)
    })
    
    it('should return error details', () => {
      const error = new Error('Test Error')
      error.response = { status: 500 }
      
      const result = handleApiError(error)
      
      expect(result).toHaveProperty('type', ErrorTypes.SERVER)
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('validationErrors')
      expect(result).toHaveProperty('originalError', error)
    })
  })
  
  describe('withRetry', () => {
    it('should retry failed API calls', async () => {
      const apiCall = vi.fn()
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce({ data: 'success' })
      
      const result = await withRetry(apiCall, { maxRetries: 3, retryDelay: 10 })
      
      expect(apiCall).toHaveBeenCalledTimes(3)
      expect(result).toEqual({ data: 'success' })
    })
    
    it('should throw error after max retries', async () => {
      const error = new Error('Network Error')
      error.response = null
      
      const apiCall = vi.fn().mockRejectedValue(error)
      
      await expect(withRetry(apiCall, { maxRetries: 2, retryDelay: 10 }))
        .rejects.toThrow('Network Error')
      
      expect(apiCall).toHaveBeenCalledTimes(3) // Initial call + 2 retries
    })
    
    it('should not retry if shouldRetry returns false', async () => {
      const error = new Error('Auth Error')
      error.response = { status: 401 }
      
      const apiCall = vi.fn().mockRejectedValue(error)
      const shouldRetry = vi.fn().mockReturnValue(false)
      
      await expect(withRetry(apiCall, { shouldRetry }))
        .rejects.toThrow('Auth Error')
      
      expect(apiCall).toHaveBeenCalledTimes(1) // Only initial call, no retries
      expect(shouldRetry).toHaveBeenCalledWith(error)
    })
    
    it('should use default shouldRetry function', async () => {
      // Network error - should retry
      const networkError = new Error('Network Error')
      networkError.response = null
      
      const apiCall1 = vi.fn()
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({ data: 'success' })
      
      await withRetry(apiCall1, { maxRetries: 1, retryDelay: 10 })
      expect(apiCall1).toHaveBeenCalledTimes(2)
      
      // Auth error - should not retry
      const authError = new Error('Auth Error')
      authError.response = { status: 401 }
      
      const apiCall2 = vi.fn().mockRejectedValue(authError)
      
      await expect(withRetry(apiCall2, { maxRetries: 1, retryDelay: 10 }))
        .rejects.toThrow('Auth Error')
      
      expect(apiCall2).toHaveBeenCalledTimes(1)
    })
  })
})