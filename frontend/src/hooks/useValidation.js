import { useState, useCallback, useMemo } from 'react'
import { 
  validateAndSanitizeFormData,
  validateTCNumber,
  validatePhoneNumber,
  validateEmail,
  validateStudentId,
  validateCourseCode,
  validatePasswordStrength
} from '../utils/validationUtils'
import { validateAcademicDate, validateSessionTiming } from '../utils/academicValidations'
import { validateSingleFile } from '../utils/fileValidations'

/**
 * Custom hook for form validation
 * 
 * @param {Object} schema - Yup validation schema
 * @param {Object} options - Validation options
 * @returns {Object} - Validation state and functions
 */
const useValidation = (schema, options = {}) => {
  const [errors, setErrors] = useState({})
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [touched, setTouched] = useState({})

  const {
    validateOnChange = true,
    validateOnBlur = true,
    sanitizeInputs = true
  } = options

  // Validate entire form
  const validateForm = useCallback(async (values) => {
    if (!schema) return { isValid: true, errors: {} }

    try {
      setIsValidating(true)
      
      const result = await validateAndSanitizeFormData(values, schema)
      
      setErrors(result.errors.reduce((acc, error) => {
        const field = error.path || 'form'
        acc[field] = error.message || error
        return acc
      }, {}))
      
      setIsValid(result.isValid)
      
      return {
        isValid: result.isValid,
        errors: result.errors,
        data: result.data
      }
    } catch (error) {
      console.error('Validation error:', error)
      setErrors({ form: 'Doğrulama hatası oluştu' })
      setIsValid(false)
      
      return {
        isValid: false,
        errors: ['Doğrulama hatası oluştu'],
        data: null
      }
    } finally {
      setIsValidating(false)
    }
  }, [schema])

  // Validate single field
  const validateField = useCallback(async (fieldName, value, allValues = {}) => {
    if (!schema) return { isValid: true, error: null }

    try {
      // Create a temporary object with just this field
      const testValues = { ...allValues, [fieldName]: value }
      
      // Validate using the schema
      await schema.validateAt(fieldName, testValues)
      
      // Clear error for this field
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
      
      return { isValid: true, error: null }
    } catch (error) {
      const errorMessage = error.message || 'Geçersiz değer'
      
      setErrors(prev => ({
        ...prev,
        [fieldName]: errorMessage
      }))
      
      return { isValid: false, error: errorMessage }
    }
  }, [schema])

  // Handle field change
  const handleFieldChange = useCallback(async (fieldName, value, allValues = {}) => {
    // Mark field as touched
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    
    // Validate on change if enabled
    if (validateOnChange) {
      await validateField(fieldName, value, allValues)
    }
  }, [validateField, validateOnChange])

  // Handle field blur
  const handleFieldBlur = useCallback(async (fieldName, value, allValues = {}) => {
    // Mark field as touched
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    
    // Validate on blur if enabled
    if (validateOnBlur) {
      await validateField(fieldName, value, allValues)
    }
  }, [validateField, validateOnBlur])

  // Get field error
  const getFieldError = useCallback((fieldName) => {
    return errors[fieldName] || null
  }, [errors])

  // Check if field has error and is touched
  const hasFieldError = useCallback((fieldName) => {
    return !!(errors[fieldName] && touched[fieldName])
  }, [errors, touched])

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({})
    setTouched({})
    setIsValid(false)
  }, [])

  // Clear specific field error
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
    
    setTouched(prev => {
      const newTouched = { ...prev }
      delete newTouched[fieldName]
      return newTouched
    })
  }, [])

  // Set field error manually
  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))
    
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }))
  }, [])

  return {
    // State
    errors,
    isValidating,
    isValid,
    touched,
    
    // Functions
    validateForm,
    validateField,
    handleFieldChange,
    handleFieldBlur,
    getFieldError,
    hasFieldError,
    clearErrors,
    clearFieldError,
    setFieldError
  }
}

/**
 * Hook for real-time field validation
 * 
 * @param {string} type - Validation type
 * @param {*} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const useFieldValidation = (type, value, options = {}) => {
  const validationResult = useMemo(() => {
    if (!value && !options.required) {
      return { isValid: true, error: null, feedback: null }
    }

    switch (type) {
      case 'tcNumber':
        return {
          isValid: validateTCNumber(value),
          error: validateTCNumber(value) ? null : 'Geçerli bir TC kimlik numarası giriniz',
          feedback: null
        }
        
      case 'phone':
        return {
          isValid: validatePhoneNumber(value),
          error: validatePhoneNumber(value) ? null : 'Geçerli bir telefon numarası giriniz',
          feedback: null
        }
        
      case 'email':
        return {
          isValid: validateEmail(value),
          error: validateEmail(value) ? null : 'Geçerli bir e-posta adresi giriniz',
          feedback: null
        }
        
      case 'studentId':
        return {
          isValid: validateStudentId(value),
          error: validateStudentId(value) ? null : 'Geçerli bir öğrenci numarası giriniz',
          feedback: null
        }
        
      case 'courseCode':
        return {
          isValid: validateCourseCode(value),
          error: validateCourseCode(value) ? null : 'Geçerli bir ders kodu giriniz (örn: CSE101)',
          feedback: null
        }
        
      case 'password':
        const passwordResult = validatePasswordStrength(value)
        return {
          isValid: passwordResult.isValid,
          error: passwordResult.isValid ? null : passwordResult.feedback[0],
          feedback: passwordResult.feedback,
          score: passwordResult.score
        }
        
      default:
        return { isValid: true, error: null, feedback: null }
    }
  }, [type, value, options.required])

  return validationResult
}

/**
 * Hook for file validation
 * 
 * @param {File} file - File to validate
 * @param {Object} config - Validation configuration
 * @returns {Object} - Validation result and state
 */
export const useFileValidation = (file, config = {}) => {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState(null)

  const validateFile = useCallback(async (fileToValidate = file) => {
    if (!fileToValidate) {
      setValidationResult(null)
      return null
    }

    try {
      setIsValidating(true)
      const result = await validateSingleFile(fileToValidate, config)
      setValidationResult(result)
      return result
    } catch (error) {
      const errorResult = { isValid: false, error: error.message }
      setValidationResult(errorResult)
      return errorResult
    } finally {
      setIsValidating(false)
    }
  }, [file, config])

  // Auto-validate when file changes
  useMemo(() => {
    if (file) {
      validateFile(file)
    }
  }, [file, validateFile])

  return {
    isValidating,
    validationResult,
    validateFile,
    isValid: validationResult?.isValid || false,
    error: validationResult?.error || null
  }
}

/**
 * Hook for academic date validation
 * 
 * @param {Date|string} date - Date to validate
 * @param {Object} calendar - Academic calendar
 * @returns {Object} - Validation result
 */
export const useAcademicDateValidation = (date, calendar) => {
  const validationResult = useMemo(() => {
    if (!date || !calendar) {
      return { isValid: true, reason: null, type: null }
    }

    return validateAcademicDate(date, calendar)
  }, [date, calendar])

  return validationResult
}

/**
 * Hook for session timing validation
 * 
 * @param {string} startTime - Start time
 * @param {string} endTime - End time
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const useSessionTimingValidation = (startTime, endTime, options = {}) => {
  const validationResult = useMemo(() => {
    if (!startTime || !endTime) {
      return { isValid: true, reason: null }
    }

    return validateSessionTiming(startTime, endTime, options)
  }, [startTime, endTime, options])

  return validationResult
}

export default useValidation