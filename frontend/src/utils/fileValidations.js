/**
 * File validation utilities
 */

/**
 * Check if file type is allowed
 * @param {File} file - File to check
 * @param {Array<string>} allowedTypes - Array of allowed MIME types
 * @returns {boolean} - Whether file type is allowed
 */
export const isAllowedFileType = (file, allowedTypes = []) => {
  if (!file || !allowedTypes.length) return false
  
  return allowedTypes.some(type => {
    if (type.includes('*')) {
      const baseType = type.split('/')[0]
      return file.type.startsWith(baseType + '/')
    }
    return file.type === type
  })
}

/**
 * Check if file size is within limit
 * @param {File} file - File to check
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} - Whether file size is within limit
 */
export const isFileSizeValid = (file, maxSize) => {
  if (!file || !maxSize) return false
  return file.size <= maxSize
}

/**
 * Get file extension from file object
 * @param {File} file - File object
 * @returns {string} - File extension (lowercase, without dot)
 */
export const getFileExtension = (file) => {
  if (!file || !file.name) return ''
  
  const parts = file.name.split('.')
  if (parts.length <= 1) return ''
  
  return parts[parts.length - 1].toLowerCase()
}

/**
 * Check if file has valid image extension
 * @param {File} file - File to check
 * @returns {boolean} - Whether file has valid image extension
 */
export const hasImageExtension = (file) => {
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
  return validExtensions.includes(getFileExtension(file))
}

/**
 * Check if file has valid document extension
 * @param {File} file - File to check
 * @returns {boolean} - Whether file has valid document extension
 */
export const hasDocumentExtension = (file) => {
  const validExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv']
  return validExtensions.includes(getFileExtension(file))
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Validate image dimensions
 * @param {File} file - Image file
 * @param {Object} options - Validation options
 * @param {number} options.minWidth - Minimum width in pixels
 * @param {number} options.maxWidth - Maximum width in pixels
 * @param {number} options.minHeight - Minimum height in pixels
 * @param {number} options.maxHeight - Maximum height in pixels
 * @param {number} options.aspectRatio - Required aspect ratio (width/height)
 * @returns {Promise<Object>} - Validation result
 */
export const validateImageDimensions = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file type'))
      return
    }
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const { width, height } = img
        const errors = []
        
        if (options.minWidth && width < options.minWidth) {
          errors.push(`Görüntü genişliği en az ${options.minWidth}px olmalıdır`)
        }
        
        if (options.maxWidth && width > options.maxWidth) {
          errors.push(`Görüntü genişliği en fazla ${options.maxWidth}px olmalıdır`)
        }
        
        if (options.minHeight && height < options.minHeight) {
          errors.push(`Görüntü yüksekliği en az ${options.minHeight}px olmalıdır`)
        }
        
        if (options.maxHeight && height > options.maxHeight) {
          errors.push(`Görüntü yüksekliği en fazla ${options.maxHeight}px olmalıdır`)
        }
        
        if (options.aspectRatio) {
          const currentRatio = width / height
          const tolerance = 0.1 // Allow 10% deviation
          
          if (Math.abs(currentRatio - options.aspectRatio) > tolerance) {
            errors.push(`Görüntü en-boy oranı yaklaşık ${options.aspectRatio.toFixed(2)} olmalıdır`)
          }
        }
        
        resolve({
          isValid: errors.length === 0,
          errors,
          dimensions: { width, height }
        })
      }
      
      img.onerror = () => {
        reject(new Error('Görüntü yüklenirken hata oluştu'))
      }
      
      img.src = e.target.result
    }
    
    reader.onerror = () => {
      reject(new Error('Dosya okunamadı'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Create a file preview URL
 * @param {File} file - File to preview
 * @returns {Promise<string>} - Preview URL
 */
export const createFilePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'))
      return
    }
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to create preview'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Validate Excel file structure
 * @param {File} file - Excel file
 * @param {Array<string>} requiredColumns - Required column names
 * @returns {Promise<Object>} - Validation result
 */
export const validateExcelStructure = async (file, requiredColumns = []) => {
  try {
    // This is a placeholder - in a real implementation, you would:
    // 1. Use a library like xlsx to read the Excel file
    // 2. Check if the required columns exist
    // 3. Return validation result
    
    // For now, we'll just return a mock result
    return {
      isValid: true,
      errors: [],
      data: []
    }
  } catch (error) {
    return {
      isValid: false,
      errors: [error.message || 'Excel dosyası doğrulanamadı'],
      data: null
    }
  }
}

/**
 * Validate PDF file
 * @param {File} file - PDF file
 * @returns {Promise<Object>} - Validation result
 */
export const validatePdfFile = async (file) => {
  try {
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      return {
        isValid: false,
        errors: ['Dosya PDF formatında değil']
      }
    }
    
    // In a real implementation, you might want to:
    // 1. Check if the PDF is not corrupted
    // 2. Check if it's not password protected
    // 3. Check other PDF-specific properties
    
    return {
      isValid: true,
      errors: []
    }
  } catch (error) {
    return {
      isValid: false,
      errors: [error.message || 'PDF dosyası doğrulanamadı']
    }
  }
}

/**
 * Comprehensive file validation
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Promise<Object>} - Validation result
 */
export const validateFile = async (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [],
    allowedExtensions = [],
    imageDimensionOptions = null,
    excelOptions = null,
    pdfOptions = null
  } = options
  
  const errors = []
  
  // Basic validations
  if (!file) {
    errors.push('Dosya seçilmedi')
    return { isValid: false, errors }
  }
  
  // Check file size
  if (!isFileSizeValid(file, maxSize)) {
    errors.push(`Dosya boyutu çok büyük (Maksimum: ${formatFileSize(maxSize)})`)
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !isAllowedFileType(file, allowedTypes)) {
    errors.push(`Desteklenmeyen dosya türü: ${file.type}`)
  }
  
  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = getFileExtension(file)
    if (!allowedExtensions.includes(extension)) {
      errors.push(`Desteklenmeyen dosya uzantısı: .${extension}`)
    }
  }
  
  // If there are already errors, return early
  if (errors.length > 0) {
    return { isValid: false, errors }
  }
  
  // Advanced validations based on file type
  try {
    // Image validation
    if (file.type.startsWith('image/') && imageDimensionOptions) {
      const imageResult = await validateImageDimensions(file, imageDimensionOptions)
      if (!imageResult.isValid) {
        errors.push(...imageResult.errors)
      }
    }
    
    // Excel validation
    if ((file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
         file.type === 'application/vnd.ms-excel') && 
        excelOptions) {
      const excelResult = await validateExcelStructure(file, excelOptions.requiredColumns)
      if (!excelResult.isValid) {
        errors.push(...excelResult.errors)
      }
    }
    
    // PDF validation
    if (file.type === 'application/pdf' && pdfOptions) {
      const pdfResult = await validatePdfFile(file)
      if (!pdfResult.isValid) {
        errors.push(...pdfResult.errors)
      }
    }
  } catch (error) {
    errors.push(error.message || 'Dosya doğrulanırken hata oluştu')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export default {
  isAllowedFileType,
  isFileSizeValid,
  getFileExtension,
  hasImageExtension,
  hasDocumentExtension,
  formatFileSize,
  validateImageDimensions,
  createFilePreview,
  validateExcelStructure,
  validatePdfFile,
  validateFile
}