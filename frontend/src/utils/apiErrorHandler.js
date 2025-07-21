/**
 * API error handler utility
 * 
 * This module provides utilities for handling API errors consistently.
 */

// Error types
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED_ERROR',
  FORBIDDEN: 'FORBIDDEN_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

/**
 * Get error type from Axios error
 * @param {Error} error - Axios error object
 * @returns {string} - Error type
 */
export const getErrorType = (error) => {
  if (error.code === 'ECONNABORTED') {
    return ErrorTypes.TIMEOUT
  }
  
  if (!error.response) {
    return ErrorTypes.NETWORK
  }
  
  const { status } = error.response
  
  switch (status) {
    case 401:
      return ErrorTypes.UNAUTHORIZED
    case 403:
      return ErrorTypes.FORBIDDEN
    case 404:
      return ErrorTypes.NOT_FOUND
    case 422:
      return ErrorTypes.VALIDATION
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorTypes.SERVER
    default:
      return ErrorTypes.UNKNOWN
  }
}

/**
 * Get user-friendly error message
 * @param {Error} error - Axios error object
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyMessage = (error) => {
  const errorType = getErrorType(error)
  
  switch (errorType) {
    case ErrorTypes.NETWORK:
      return 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'
    case ErrorTypes.TIMEOUT:
      return 'İstek zaman aşımına uğradı. Lütfen daha sonra tekrar deneyin.'
    case ErrorTypes.UNAUTHORIZED:
      return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.'
    case ErrorTypes.FORBIDDEN:
      return 'Bu işlem için yetkiniz bulunmuyor.'
    case ErrorTypes.NOT_FOUND:
      return 'İstenen kaynak bulunamadı.'
    case ErrorTypes.VALIDATION:
      // Try to get validation errors from response
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        if (Array.isArray(errors) && errors.length > 0) {
          return errors[0].message || 'Doğrulama hatası.'
        }
        
        // Handle object format
        if (typeof errors === 'object') {
          const firstError = Object.values(errors)[0]
          if (Array.isArray(firstError) && firstError.length > 0) {
            return firstError[0]
          }
          return String(firstError)
        }
      }
      return error.response?.data?.message || 'Gönderilen veriler geçersiz.'
    case ErrorTypes.SERVER:
      return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
    default:
      return error.response?.data?.message || error.message || 'Bilinmeyen bir hata oluştu.'
  }
}

/**
 * Extract validation errors from response
 * @param {Error} error - Axios error object
 * @returns {Object|Array|null} - Validation errors
 */
export const getValidationErrors = (error) => {
  if (getErrorType(error) !== ErrorTypes.VALIDATION) {
    return null
  }
  
  return error.response?.data?.errors || null
}

/**
 * Format validation errors for display
 * @param {Object|Array} errors - Validation errors
 * @returns {Array} - Formatted error messages
 */
export const formatValidationErrors = (errors) => {
  if (!errors) return []
  
  if (Array.isArray(errors)) {
    return errors.map(err => err.message || String(err))
  }
  
  if (typeof errors === 'object') {
    return Object.entries(errors).map(([field, messages]) => {
      if (Array.isArray(messages)) {
        return `${field}: ${messages[0]}`
      }
      return `${field}: ${messages}`
    })
  }
  
  return [String(errors)]
}

/**
 * Check if error is a network error
 * @param {Error} error - Axios error object
 * @returns {boolean} - Whether error is a network error
 */
export const isNetworkError = (error) => {
  return getErrorType(error) === ErrorTypes.NETWORK
}

/**
 * Check if error is a server error
 * @param {Error} error - Axios error object
 * @returns {boolean} - Whether error is a server error
 */
export const isServerError = (error) => {
  return getErrorType(error) === ErrorTypes.SERVER
}

/**
 * Check if error is an authentication error
 * @param {Error} error - Axios error object
 * @returns {boolean} - Whether error is an authentication error
 */
export const isAuthError = (error) => {
  return getErrorType(error) === ErrorTypes.UNAUTHORIZED
}

/**
 * Create a standardized error object
 * @param {Error} error - Axios error object
 * @returns {Object} - Standardized error object
 */
export const createErrorObject = (error) => {
  const errorType = getErrorType(error)
  const message = getUserFriendlyMessage(error)
  const statusCode = error.response?.status
  const responseData = error.response?.data
  const validationErrors = getValidationErrors(error)
  
  return {
    type: errorType,
    message,
    statusCode,
    responseData,
    validationErrors,
    originalError: error,
    timestamp: new Date().toISOString()
  }
}

export default {
  ErrorTypes,
  getErrorType,
  getUserFriendlyMessage,
  getValidationErrors,
  formatValidationErrors,
  isNetworkError,
  isServerError,
  isAuthError,
  createErrorObject
}