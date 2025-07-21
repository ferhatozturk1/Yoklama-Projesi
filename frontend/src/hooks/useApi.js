import { useState, useCallback, useRef, useEffect } from 'react'
import apiClient, { apiRequest } from '../utils/apiClient'
import { createErrorObject, getValidationErrors } from '../utils/apiErrorHandler'
import { showSuccess, showError } from '../components/common/ToastNotification'

/**
 * Custom hook for making API requests with error handling
 * 
 * @param {Object} options - Hook options
 * @returns {Object} - API request state and functions
 */
const useApi = (options = {}) => {
  const {
    showSuccessNotification = false,
    showErrorNotification = true,
    successMessage = 'İşlem başarıyla tamamlandı',
    transformResponse = data => data,
    onSuccess = null,
    onError = null,
    autoAbortOnUnmount = true
  } = options
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [validationErrors, setValidationErrors] = useState(null)
  
  // Keep track of abort controllers for in-flight requests
  const abortControllersRef = useRef([])
  
  /**
   * Create a new abort controller
   * @returns {AbortController} - Abort controller
   */
  const createAbortController = useCallback(() => {
    const controller = new AbortController()
    abortControllersRef.current.push(controller)
    return controller
  }, [])
  
  /**
   * Remove an abort controller from the list
   * @param {AbortController} controller - Abort controller to remove
   */
  const removeAbortController = useCallback((controller) => {
    abortControllersRef.current = abortControllersRef.current.filter(c => c !== controller)
  }, [])
  
  /**
   * Abort all in-flight requests
   */
  const abortAll = useCallback(() => {
    abortControllersRef.current.forEach(controller => {
      try {
        controller.abort()
      } catch (error) {
        console.error('Error aborting request:', error)
      }
    })
    abortControllersRef.current = []
  }, [])
  
  /**
   * Reset request state
   */
  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
    setValidationErrors(null)
  }, [])
  
  /**
   * Make API request
   * @param {Function|Object} configOrFn - Axios config object or function that returns config
   * @param {Object} requestOptions - Request-specific options
   * @returns {Promise} - API response
   */
  const request = useCallback(async (configOrFn, requestOptions = {}) => {
    // Merge options
    const mergedOptions = {
      showSuccessNotification,
      showErrorNotification,
      successMessage,
      transformResponse,
      onSuccess,
      onError,
      ...requestOptions
    }
    
    // Reset state
    setError(null)
    setValidationErrors(null)
    setLoading(true)
    
    // Create abort controller
    const controller = createAbortController()
    
    try {
      // Get config
      const config = typeof configOrFn === 'function' ? configOrFn() : configOrFn
      
      // Add abort signal to config
      const requestConfig = {
        ...config,
        signal: controller.signal
      }
      
      // Make request
      const response = await apiClient(requestConfig)
      
      // Transform response
      const transformedData = mergedOptions.transformResponse(response.data)
      
      // Update state
      setData(transformedData)
      
      // Show success notification
      if (mergedOptions.showSuccessNotification) {
        showSuccess(mergedOptions.successMessage)
      }
      
      // Call success callback
      if (mergedOptions.onSuccess) {
        mergedOptions.onSuccess(transformedData, response)
      }
      
      return transformedData
    } catch (error) {
      // Ignore aborted requests
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        return
      }
      
      // Create standardized error object
      const errorObj = createErrorObject(error)
      
      // Extract validation errors
      const validationErrors = getValidationErrors(error)
      
      // Update state
      setError(errorObj)
      setValidationErrors(validationErrors)
      
      // Show error notification
      if (mergedOptions.showErrorNotification) {
        showError(errorObj.message)
      }
      
      // Call error callback
      if (mergedOptions.onError) {
        mergedOptions.onError(errorObj, error)
      }
      
      throw error
    } finally {
      setLoading(false)
      removeAbortController(controller)
    }
  }, [
    showSuccessNotification,
    showErrorNotification,
    successMessage,
    transformResponse,
    onSuccess,
    onError,
    createAbortController,
    removeAbortController
  ])
  
  /**
   * Make GET request
   * @param {string} url - Request URL
   * @param {Object} params - URL parameters
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  const get = useCallback((url, params = {}, options = {}) => {
    return request({
      method: 'get',
      url,
      params
    }, options)
  }, [request])
  
  /**
   * Make POST request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  const post = useCallback((url, data = {}, options = {}) => {
    return request({
      method: 'post',
      url,
      data
    }, options)
  }, [request])
  
  /**
   * Make PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  const put = useCallback((url, data = {}, options = {}) => {
    return request({
      method: 'put',
      url,
      data
    }, options)
  }, [request])
  
  /**
   * Make PATCH request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  const patch = useCallback((url, data = {}, options = {}) => {
    return request({
      method: 'patch',
      url,
      data
    }, options)
  }, [request])
  
  /**
   * Make DELETE request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  const del = useCallback((url, options = {}) => {
    return request({
      method: 'delete',
      url
    }, options)
  }, [request])
  
  /**
   * Upload file
   * @param {string} url - Request URL
   * @param {File|FormData} file - File or FormData object
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  const upload = useCallback((url, file, options = {}) => {
    const formData = file instanceof FormData ? file : new FormData()
    
    if (!(file instanceof FormData)) {
      formData.append('file', file)
    }
    
    return request({
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }, options)
  }, [request])
  
  /**
   * Download file
   * @param {string} url - Request URL
   * @param {Object} params - URL parameters
   * @param {string} filename - Download filename
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  const download = useCallback((url, params = {}, filename = '', options = {}) => {
    return request({
      method: 'get',
      url,
      params,
      responseType: 'blob'
    }, {
      transformResponse: (data) => {
        // Create download link
        const downloadUrl = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = downloadUrl
        link.setAttribute('download', filename || 'download')
        document.body.appendChild(link)
        link.click()
        link.remove()
        
        return data
      },
      ...options
    })
  }, [request])
  
  // Abort all requests on unmount
  useEffect(() => {
    return () => {
      if (autoAbortOnUnmount) {
        abortAll()
      }
    }
  }, [autoAbortOnUnmount, abortAll])
  
  return {
    // State
    loading,
    error,
    data,
    validationErrors,
    
    // Methods
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    download,
    reset,
    abortAll
  }
}

export default useApi