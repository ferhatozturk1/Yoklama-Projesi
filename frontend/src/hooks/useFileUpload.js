import { useState, useCallback } from 'react'
import { showError, showSuccess } from '../components/common/ToastNotification'

/**
 * Custom hook for managing file uploads
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.endpoint - API endpoint for file upload
 * @param {Function} options.onSuccess - Callback on successful upload
 * @param {Function} options.onError - Callback on upload error
 * @param {boolean} options.showNotifications - Whether to show toast notifications
 * @returns {Object} - Upload state and functions
 */
const useFileUpload = ({
  endpoint,
  onSuccess,
  onError,
  showNotifications = true
} = {}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploadError, setUploadError] = useState(null)

  // Upload single file
  const uploadFile = useCallback(async (file, options = {}) => {
    if (!file) {
      const error = 'No file provided'
      setUploadError(error)
      if (showNotifications) showError(error)
      if (onError) onError(error)
      return null
    }

    try {
      setIsUploading(true)
      setUploadError(null)
      setUploadProgress(0)

      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      
      // Add additional fields if provided
      if (options.additionalFields) {
        Object.entries(options.additionalFields).forEach(([key, value]) => {
          formData.append(key, value)
        })
      }

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest()
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
          if (options.onProgress) {
            options.onProgress(progress)
          }
        }
      })

      // Handle upload completion
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              resolve(response)
            } catch (e) {
              resolve({ success: true, data: xhr.responseText })
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        }
        
        xhr.onerror = () => {
          reject(new Error('Upload failed'))
        }
      })

      // Start upload
      const uploadEndpoint = endpoint || '/api/upload'
      xhr.open('POST', uploadEndpoint)
      
      // Add authorization header if available
      const token = localStorage.getItem('token')
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      
      xhr.send(formData)

      // Wait for completion
      const result = await uploadPromise
      
      // Update state
      setUploadedFiles(prev => [...prev, { file, result }])
      setUploadProgress(100)
      
      // Show success notification
      if (showNotifications) {
        showSuccess(`${file.name} başarıyla yüklendi`)
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result, file)
      }
      
      return result

    } catch (error) {
      console.error('File upload error:', error)
      const errorMessage = error.message || 'Dosya yüklenirken hata oluştu'
      
      setUploadError(errorMessage)
      
      if (showNotifications) {
        showError(errorMessage)
      }
      
      if (onError) {
        onError(error, file)
      }
      
      return null
    } finally {
      setIsUploading(false)
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [endpoint, onSuccess, onError, showNotifications])

  // Upload multiple files
  const uploadFiles = useCallback(async (files, options = {}) => {
    if (!files || files.length === 0) {
      const error = 'No files provided'
      setUploadError(error)
      if (showNotifications) showError(error)
      if (onError) onError(error)
      return []
    }

    const results = []
    const fileArray = Array.isArray(files) ? files : [files]
    
    try {
      setIsUploading(true)
      setUploadError(null)
      
      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        const fileOptions = {
          ...options,
          onProgress: (progress) => {
            // Calculate overall progress
            const overallProgress = Math.round(((i * 100) + progress) / fileArray.length)
            setUploadProgress(overallProgress)
            if (options.onProgress) {
              options.onProgress(overallProgress, i, fileArray.length)
            }
          }
        }
        
        const result = await uploadFile(file, fileOptions)
        results.push({ file, result, success: result !== null })
      }
      
      return results
      
    } catch (error) {
      console.error('Multiple file upload error:', error)
      const errorMessage = error.message || 'Dosyalar yüklenirken hata oluştu'
      
      setUploadError(errorMessage)
      
      if (showNotifications) {
        showError(errorMessage)
      }
      
      if (onError) {
        onError(error)
      }
      
      return results
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [uploadFile, showNotifications, onError])

  // Clear uploaded files
  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([])
    setUploadError(null)
    setUploadProgress(0)
  }, [])

  // Reset upload state
  const resetUploadState = useCallback(() => {
    setIsUploading(false)
    setUploadProgress(0)
    setUploadedFiles([])
    setUploadError(null)
  }, [])

  return {
    // State
    isUploading,
    uploadProgress,
    uploadedFiles,
    uploadError,
    
    // Functions
    uploadFile,
    uploadFiles,
    clearUploadedFiles,
    resetUploadState
  }
}

export default useFileUpload