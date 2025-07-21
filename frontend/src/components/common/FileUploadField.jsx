import React, { useState, useCallback, useEffect } from 'react'
import { useField, useFormikContext } from 'formik'
import { useDropzone } from 'react-dropzone'
import { validateFile, formatFileSize } from '../../utils/fileValidations'

/**
 * File upload field component with validation
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Field label
 * @param {string} props.name - Field name
 * @param {string} props.accept - Accepted file types
 * @param {number} props.maxSize - Maximum file size in bytes
 * @param {boolean} props.multiple - Whether multiple files are allowed
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.helpText - Help text
 * @param {boolean} props.showPreview - Whether to show file preview
 * @param {Function} props.onFileValidated - Callback when file is validated
 */
const FileUploadField = ({
  label,
  name,
  accept = '',
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  required = false,
  helpText = '',
  showPreview = true,
  onFileValidated,
  ...props
}) => {
  const [field, meta, helpers] = useField(name)
  const { setFieldValue, setFieldTouched } = useFormikContext()
  const [previews, setPreviews] = useState([])
  const [validationErrors, setValidationErrors] = useState([])
  const [isValidating, setIsValidating] = useState(false)
  
  // Parse accept string into array of MIME types
  const acceptedTypes = accept.split(',').map(type => type.trim()).filter(Boolean)
  
  // Convert accept string to object for react-dropzone
  const acceptObject = accept.split(',').reduce((acc, type) => {
    type = type.trim()
    if (type.startsWith('.')) {
      // It's an extension
      acc[type] = []
    } else if (type.includes('/')) {
      // It's a MIME type
      const [main, sub] = type.split('/')
      if (!acc[main]) acc[main] = []
      if (sub !== '*') acc[main].push(sub)
    }
    return acc
  }, {})
  
  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles) => {
    setFieldTouched(name, true, false)
    setIsValidating(true)
    setValidationErrors([])
    
    try {
      // Validate each file
      const validationPromises = acceptedFiles.map(file => 
        validateFile(file, {
          maxSize,
          allowedTypes: acceptedTypes,
          imageDimensionOptions: props.imageDimensionOptions
        })
      )
      
      const validationResults = await Promise.all(validationPromises)
      
      // Collect all errors
      const errors = validationResults.flatMap((result, index) => 
        result.isValid ? [] : result.errors.map(error => `${acceptedFiles[index].name}: ${error}`)
      )
      
      if (errors.length > 0) {
        setValidationErrors(errors)
        return
      }
      
      // Update form value
      const newValue = multiple ? acceptedFiles : acceptedFiles[0]
      setFieldValue(name, newValue)
      
      // Generate previews for images
      if (showPreview) {
        const newPreviews = acceptedFiles.map(file => ({
          file,
          url: URL.createObjectURL(file)
        }))
        setPreviews(prev => [...prev, ...newPreviews])
      }
      
      // Call onFileValidated callback if provided
      if (onFileValidated) {
        onFileValidated(multiple ? acceptedFiles : acceptedFiles[0])
      }
    } catch (error) {
      setValidationErrors([error.message || 'Dosya doğrulanırken hata oluştu'])
    } finally {
      setIsValidating(false)
    }
  }, [name, multiple, maxSize, acceptedTypes, setFieldValue, setFieldTouched, showPreview, onFileValidated, props.imageDimensionOptions])
  
  // Handle file rejection
  const onDropRejected = useCallback((rejectedFiles) => {
    setFieldTouched(name, true, false)
    
    const errors = rejectedFiles.map(({ file, errors }) => 
      errors.map(error => `${file.name}: ${error.message}`).join(', ')
    )
    
    setValidationErrors(errors)
  }, [name, setFieldTouched])
  
  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url))
    }
  }, [previews])
  
  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDropRejected,
    accept: Object.keys(acceptObject).length > 0 ? acceptObject : undefined,
    maxSize,
    multiple,
    disabled: props.disabled
  })
  
  // Remove a file
  const removeFile = (index) => {
    if (multiple) {
      const newFiles = [...field.value]
      newFiles.splice(index, 1)
      setFieldValue(name, newFiles)
      
      // Remove preview
      if (showPreview) {
        const newPreviews = [...previews]
        URL.revokeObjectURL(newPreviews[index].url)
        newPreviews.splice(index, 1)
        setPreviews(newPreviews)
      }
    } else {
      setFieldValue(name, null)
      
      // Remove preview
      if (showPreview && previews.length > 0) {
        URL.revokeObjectURL(previews[0].url)
        setPreviews([])
      }
    }
  }
  
  // Determine if we have files
  const hasFiles = multiple ? (field.value && field.value.length > 0) : !!field.value
  
  // Determine if there's an error
  const hasError = meta.touched && (meta.error || validationErrors.length > 0)
  
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        {...getRootProps()}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 
          isDragReject ? 'border-red-400 bg-red-50' : 
          hasError ? 'border-red-300 bg-red-50' : 
          'border-gray-300 hover:border-gray-400'
        } ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="space-y-1 text-center">
          <svg
            className={`mx-auto h-12 w-12 ${
              isDragActive ? 'text-blue-500' : 
              isDragReject ? 'text-red-500' : 
              hasError ? 'text-red-500' : 
              'text-gray-400'
            }`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <input {...getInputProps()} />
            <p className="pl-1">
              {isDragActive
                ? 'Dosyayı buraya bırakın...'
                : `Dosya seçmek için tıklayın veya sürükleyin ${
                    accept ? `(${accept})` : ''
                  }`}
            </p>
          </div>
          <p className="text-xs text-gray-500">
            {`Maksimum boyut: ${formatFileSize(maxSize)}`}
          </p>
        </div>
      </div>
      
      {/* Help text */}
      {helpText && !hasError && (
        <p className="mt-2 text-sm text-gray-500">{helpText}</p>
      )}
      
      {/* Validation errors */}
      {hasError && (
        <div className="mt-2 text-sm text-red-600">
          {meta.error && <p>{meta.error}</p>}
          {validationErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      
      {/* Loading indicator */}
      {isValidating && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Dosya doğrulanıyor...
        </div>
      )}
      
      {/* File previews */}
      {showPreview && hasFiles && (
        <div className="mt-4 space-y-2">
          {multiple
            ? field.value.map((file, index) => (
                <FilePreview
                  key={index}
                  file={file}
                  preview={previews[index]?.url}
                  onRemove={() => removeFile(index)}
                  disabled={props.disabled}
                />
              ))
            : field.value && (
                <FilePreview
                  file={field.value}
                  preview={previews[0]?.url}
                  onRemove={() => removeFile(0)}
                  disabled={props.disabled}
                />
              )}
        </div>
      )}
    </div>
  )
}

/**
 * File preview component
 */
const FilePreview = ({ file, preview, onRemove, disabled }) => {
  const isImage = file.type.startsWith('image/')
  
  return (
    <div className="flex items-center p-2 bg-gray-50 rounded-md">
      {isImage && preview ? (
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src={preview}
            alt={file.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-white">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      
      <div className="ml-4 flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </p>
      </div>
      
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default FileUploadField