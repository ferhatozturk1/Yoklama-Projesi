import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const FileUploader = ({ 
  onFileSelect, 
  acceptedTypes = ['image/*'], 
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  className = '',
  label = 'Dosya Seç',
  description = 'Dosyayı buraya sürükleyin veya tıklayarak seçin'
}) => {
  const [uploadError, setUploadError] = useState('')
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setUploadError('')
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setUploadError(`Dosya boyutu ${maxSize / (1024 * 1024)}MB'dan küçük olmalıdır`)
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setUploadError('Desteklenmeyen dosya formatı')
      } else {
        setUploadError('Dosya yüklenirken hata oluştu')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target.result)
        reader.readAsDataURL(file)
      }
      
      onFileSelect(file)
    }
  }, [onFileSelect, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {}),
    maxSize,
    multiple
  })

  const removeFile = () => {
    setPreview(null)
    onFileSelect(null)
    setUploadError('')
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploadError ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-24 h-24 object-cover rounded-lg mx-auto"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600">Değiştirmek için tıklayın</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
              <p className="text-xs text-gray-400 mt-1">
                Maksimum boyut: {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      {uploadError && (
        <p className="text-red-500 text-sm mt-2">{uploadError}</p>
      )}
    </div>
  )
}

export default FileUploader