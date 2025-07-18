import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { showError, showWarning } from './ToastNotification'
import LoadingSpinner from './LoadingSpinner'

/**
 * A reusable file upload component with drag-and-drop support
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onFileSelect - Callback when file is selected
 * @param {Function} props.onFileUpload - Callback when file is uploaded
 * @param {Object} props.acceptedFileTypes - Object with file types as keys and arrays of extensions as values
 * @param {number} props.maxFileSize - Maximum file size in bytes
 * @param {boolean} props.multiple - Whether to allow multiple file uploads
 * @param {string} props.uploadButtonText - Text for the upload button
 * @param {string} props.dropzoneText - Text for the dropzone
 * @param {string} props.dropzoneActiveText - Text for the dropzone when active
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.autoUpload - Whether to automatically upload files when selected
 * @param {boolean} props.showPreview - Whether to show file preview
 * @param {boolean} props.disabled - Whether the uploader is disabled
 */
const FileUploader = ({
  onFileSelect,
  onFileUpload,
  acceptedFileTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    'application/pdf': ['.pdf']
  },
  maxFileSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  uploadButtonText = 'Yükle',
  dropzoneText = 'Dosya yüklemek için tıklayın veya sürükleyin',
  dropzoneActiveText = 'Dosyayı buraya bırakın',
  className = '',
  autoUpload = false,
  showPreview = true,
  disabled = false
}) => {
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrls, setPreviewUrls] = useState([])

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  // Generate preview URLs for selected files
  useEffect(() => {
    if (!showPreview) return

    const newPreviewUrls = files.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file)
      }
      return null
    })

    setPreviewUrls(newPreviewUrls)

    return () => {
      newPreviewUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [files, showPreview])

  // Handle file drop
  const onDrop = useCallback(acceptedFiles => {
    // Check file size
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxFileSize)
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ')
      showWarning(`Dosya boyutu çok büyük: ${fileNames}. Maksimum boyut: ${Math.round(maxFileSize / 1024 / 1024)}MB`)
      
      // Filter out oversized files
      acceptedFiles = acceptedFiles.filter(file => file.size <= maxFileSize)
      if (acceptedFiles.length === 0) return
    }

    // Update files state
    if (multiple) {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles])
    } else {
      setFiles(acceptedFiles)
    }

    // Call onFileSelect callback
    if (onFileSelect) {
      onFileSelect(multiple ? acceptedFiles : acceptedFiles[0])
    }

    // Auto upload if enabled
    if (autoUpload && onFileUpload) {
      handleUpload(acceptedFiles)
    }
  }, [multiple, maxFileSize, autoUpload, onFileSelect, onFileUpload])

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple,
    disabled: disabled || isUploading
  })

  // Handle file upload
  const handleUpload = async (filesToUpload = files) => {
    if (!onFileUpload || filesToUpload.length === 0) return

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      // Call onFileUpload callback
      await onFileUpload(multiple ? filesToUpload : filesToUpload[0], {
        onProgress: (progress) => {
          clearInterval(progressInterval)
          setUploadProgress(progress)
        }
      })

      // Clear progress interval and set progress to 100%
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Clear files if not multiple
      if (!multiple) {
        setFiles([])
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      showError('Dosya yüklenirken bir hata oluştu.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Handle file removal
  const handleRemoveFile = (index) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles]
      newFiles.splice(index, 1)
      return newFiles
    })

    if (showPreview) {
      setPreviewUrls(prevUrls => {
        const newUrls = [...prevUrls]
        if (newUrls[index]) {
          URL.revokeObjectURL(newUrls[index])
        }
        newUrls.splice(index, 1)
        return newUrls
      })
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    } else if (file.type === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  }

  return (
    <div className={`file-uploader ${className}`}>
      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-4">
            <LoadingSpinner size="medium" className="mx-auto" />
            <div>
              <p className="font-medium">Yükleniyor...</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <>
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-4 text-lg font-medium">
              {isDragActive ? dropzoneActiveText : dropzoneText}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {Object.entries(acceptedFileTypes).map(([type, extensions]) => {
                const formattedType = type.replace('*', '').replace('/', '')
                return `${formattedType} (${extensions.join(', ')})`
              }).join(', ')}
              {` (maks. ${formatFileSize(maxFileSize)})`}
            </p>
          </>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Seçilen Dosyalar</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getFileIcon(file)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isUploading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File Previews */}
      {showPreview && previewUrls.some(url => url !== null) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Önizleme</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {previewUrls.map((url, index) => {
              if (!url) return null
              return (
                <div key={`preview-${index}`} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-gray-400 hover:text-gray-600"
                    disabled={isUploading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {!autoUpload && files.length > 0 && onFileUpload && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => handleUpload()}
            className="btn btn-primary"
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-2" />
                <span>Yükleniyor...</span>
              </div>
            ) : (
              uploadButtonText
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUploader