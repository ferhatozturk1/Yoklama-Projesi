import { useState, useCallback } from 'react'
import { getValidationErrors, formatValidationErrors } from '../utils/apiErrorHandler'

/**
 * Custom hook for handling API validation errors
 * 
 * @param {Object} options - Hook options
 * @returns {Object} - Validation state and functions
 */
const useApiValidation = (options = {}) => {
  const {
    initialErrors = null,
    mapErrorsToFormik = true
  } = options
  
  const [validationErrors, setValidationErrors] = useState(initialErrors)
  
  /**
   * Set validation errors
   * @param {Object|Array} errors - Validation errors
   */
  const setErrors = useCallback((errors) => {
    setValidationErrors(errors)
  }, [])
  
  /**
   * Clear validation errors
   */
  const clearErrors = useCallback(() => {
    setValidationErrors(null)
  }, [])
  
  /**
   * Extract validation errors from API error
   * @param {Error} error - API error
   */
  const extractErrors = useCallback((error) => {
    const errors = getValidationErrors(error)
    setValidationErrors(errors)
    return errors
  }, [])
  
  /**
   * Format validation errors for display
   * @returns {Array} - Formatted error messages
   */
  const getFormattedErrors = useCallback(() => {
    return formatValidationErrors(validationErrors)
  }, [validationErrors])
  
  /**
   * Check if field has error
   * @param {string} field - Field name
   * @returns {boolean} - Whether field has error
   */
  const hasError = useCallback((field) => {
    if (!validationErrors) return false
    
    if (Array.isArray(validationErrors)) {
      return validationErrors.some(err => err.field === field)
    }
    
    return !!validationErrors[field]
  }, [validationErrors])
  
  /**
   * Get error message for field
   * @param {string} field - Field name
   * @returns {string|null} - Error message
   */
  const getError = useCallback((field) => {
    if (!validationErrors) return null
    
    if (Array.isArray(validationErrors)) {
      const error = validationErrors.find(err => err.field === field)
      return error ? error.message : null
    }
    
    if (typeof validationErrors[field] === 'string') {
      return validationErrors[field]
    }
    
    if (Array.isArray(validationErrors[field]) && validationErrors[field].length > 0) {
      return validationErrors[field][0]
    }
    
    return null
  }, [validationErrors])
  
  /**
   * Map validation errors to Formik errors object
   * @returns {Object} - Formik errors object
   */
  const getFormikErrors = useCallback(() => {
    if (!validationErrors) return {}
    
    if (Array.isArray(validationErrors)) {
      return validationErrors.reduce((acc, err) => {
        if (err.field) {
          acc[err.field] = err.message
        }
        return acc
      }, {})
    }
    
    return Object.entries(validationErrors).reduce((acc, [field, message]) => {
      acc[field] = Array.isArray(message) ? message[0] : message
      return acc
    }, {})
  }, [validationErrors])
  
  /**
   * Handle API error in Formik form
   * @param {Error} error - API error
   * @param {Object} formikHelpers - Formik helpers
   */
  const handleFormikError = useCallback((error, formikHelpers) => {
    if (!formikHelpers || !mapErrorsToFormik) return
    
    const errors = extractErrors(error)
    
    if (errors) {
      const formikErrors = getFormikErrors()
      formikHelpers.setErrors(formikErrors)
    }
  }, [extractErrors, getFormikErrors, mapErrorsToFormik])
  
  return {
    // State
    validationErrors,
    
    // Methods
    setErrors,
    clearErrors,
    extractErrors,
    getFormattedErrors,
    hasError,
    getError,
    getFormikErrors,
    handleFormikError
  }
}

export default useApiValidation