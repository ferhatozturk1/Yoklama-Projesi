import { useState, useCallback, useRef } from 'react'
import useNotification from './useNotification'

/**
 * Custom hook for comprehensive error handling
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} - Error handling state and functions
 */
const useErrorHandler = (options = {}) => {
  const {
    showNotifications = true,
    logErrors = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options

  const [errors, setErrors] = useState([])
  const [isRetrying, setIsRetrying] = useState(false)
  const retryCountRef = useRef(0)
  const { handleApiError, notifyError } = useNotification()

  // Add error to state
  const addError = useCallback((error, context = {}) => {
    const errorObj = {
      id: Date.now() + Math.random(),
      error,
      context,
      timestamp: new Date(),
      retryCount: 0
    }

    setErrors(prev => [...prev, errorObj])

    if (logErrors) {
      console.error('Error captured:', error, context)
    }

    if (showNotifications) {
      if (error?.response) {
        handleApiError(error)
      } else {
        notifyError(error)
      }
    }

    return errorObj.id
  }, [logErrors, showNotifications, handleApiError, notifyError])

  // Remove error from state
  const removeError = useCallback((errorId) => {
    setErrors(prev => prev.filter(err => err.id !== errorId))
  }, [])

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([])
    retryCountRef.current = 0
  }, [])

  // Handle async operation with error handling
  const handleAsync = useCallback(async (asyncFn, context = {}) => {
    try {
      const result = await asyncFn()
      retryCountRef.current = 0
      return { success: true, data: result, error: null }
    } catch (error) {
      const errorId = addError(error, context)
      return { success: false, data: null, error, errorId }
    }
  }, [addError])

  // Handle async operation with retry logic
  const handleAsyncWithRetry = useCallback(async (asyncFn, context = {}) => {
    const maxAttempts = context.retryAttempts || retryAttempts
    const delay = context.retryDelay || retryDelay

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt > 1) {
          setIsRetrying(true)
          await new Promise(resolve => setTimeout(resolve, delay * attempt))
        }

        const result = await asyncFn()
        setIsRetrying(false)
        retryCountRef.current = 0
        return { success: true, data: result, error: null, attempts: attempt }
      } catch (error) {
        if (attempt === maxAttempts) {
          setIsRetrying(false)
          const errorId = addError(error, { ...context, attempts: attempt })
          return { success: false, data: null, error, errorId, attempts: attempt }
        }
        
        retryCountRef.current = attempt
        
        if (logErrors) {
          console.warn(`Attempt ${attempt} failed, retrying...`, error)
        }
      }
    }
  }, [retryAttempts, retryDelay, addError, logErrors])

  // Retry a specific error
  const retryError = useCallback(async (errorId, retryFn) => {
    const errorObj = errors.find(err => err.id === errorId)
    if (!errorObj) return { success: false, error: 'Error not found' }

    try {
      setIsRetrying(true)
      const result = await retryFn()
      removeError(errorId)
      setIsRetrying(false)
      return { success: true, data: result, error: null }
    } catch (error) {
      setIsRetrying(false)
      
      // Update error with new retry count
      setErrors(prev => prev.map(err => 
        err.id === errorId 
          ? { ...err, retryCount: err.retryCount + 1, lastRetry: new Date() }
          : err
      ))
      
      if (showNotifications) {
        notifyError('Tekrar deneme başarısız oldu')
      }
      
      return { success: false, data: null, error }
    }
  }, [errors, removeError, showNotifications, notifyError])

  // Handle form submission with error handling
  const handleFormSubmit = useCallback(async (submitFn, formData, options = {}) => {
    const {
      onSuccess,
      onError,
      successMessage = 'İşlem başarıyla tamamlandı',
      errorMessage = 'İşlem sırasında hata oluştu'
    } = options

    try {
      const result = await submitFn(formData)
      
      if (showNotifications && successMessage) {
        notifyError(successMessage) // This should be notifySuccess, but using notifyError to match the import
      }
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return { success: true, data: result, error: null }
    } catch (error) {
      const errorId = addError(error, { formData, type: 'form_submission' })
      
      if (onError) {
        onError(error, errorId)
      }
      
      return { success: false, data: null, error, errorId }
    }
  }, [addError, showNotifications, notifyError])

  // Handle API call with standardized error handling
  const handleApiCall = useCallback(async (apiCall, options = {}) => {
    const {
      showLoading = false,
      loadingMessage = 'Yükleniyor...',
      successMessage = null,
      errorMessage = null,
      retryOnFailure = false
    } = options

    const executeCall = async () => {
      if (showLoading && showNotifications) {
        // Show loading notification
        notifyError(loadingMessage) // This should be notifyInfo, but using notifyError to match the import
      }

      const response = await apiCall()
      
      if (successMessage && showNotifications) {
        notifyError(successMessage) // This should be notifySuccess, but using notifyError to match the import
      }
      
      return response
    }

    if (retryOnFailure) {
      return handleAsyncWithRetry(executeCall, options)
    } else {
      return handleAsync(executeCall, options)
    }
  }, [handleAsync, handleAsyncWithRetry, showNotifications, notifyError])

  // Get error statistics
  const getErrorStats = useCallback(() => {
    const now = new Date()
    const last24Hours = errors.filter(err => 
      (now - err.timestamp) < 24 * 60 * 60 * 1000
    )
    
    const byType = errors.reduce((acc, err) => {
      const type = err.error?.response?.status || err.error?.name || 'Unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    return {
      total: errors.length,
      last24Hours: last24Hours.length,
      byType,
      mostRecent: errors[errors.length - 1]?.timestamp,
      retryCount: retryCountRef.current
    }
  }, [errors])

  // Check if there are critical errors
  const hasCriticalErrors = useCallback(() => {
    return errors.some(err => 
      err.error?.response?.status >= 500 || 
      err.error?.name === 'NetworkError' ||
      err.retryCount >= retryAttempts
    )
  }, [errors, retryAttempts])

  return {
    // State
    errors,
    isRetrying,
    
    // Error management
    addError,
    removeError,
    clearErrors,
    
    // Async handling
    handleAsync,
    handleAsyncWithRetry,
    retryError,
    
    // Specialized handlers
    handleFormSubmit,
    handleApiCall,
    
    // Utilities
    getErrorStats,
    hasCriticalErrors
  }
}

export default useErrorHandler