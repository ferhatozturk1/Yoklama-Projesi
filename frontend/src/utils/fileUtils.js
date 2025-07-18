/**
 * File utility functions for handling file operations
 */

/**
 * Validate file type against allowed types
 * @param {File} file - The file to validate
 * @param {Object} allowedTypes - Object with MIME types as keys and extensions as values
 * @returns {boolean} - Whether the file type is allowed
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file || !allowedTypes) return false

  // Check MIME type
  for (const [mimeType, extensions] of Object.entries(allowedTypes)) {
    if (mimeType.includes('*')) {
      // Handle wildcard MIME types like 'image/*'
      const baseType = mimeType.split('/')[0]
      if (file.type.startsWith(baseType + '/')) {
        return true
      }
    } else if (file.type === mimeType) {
      return true
    }
  }

  // Check file extension as fallback
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
  for (const extensions of Object.values(allowedTypes)) {
    if (extensions.includes(fileExtension)) {
      return true
    }
  }

  return false
}

/**
 * Validate file size
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {boolean} - Whether the file size is valid
 */
export const validateFileSize = (file, maxSize) => {
  if (!file || !maxSize) return false
  return file.size <= maxSize
}

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - File extension (without dot)
 */
export const getFileExtension = (filename) => {
  if (!filename) return ''
  return filename.split('.').pop().toLowerCase()
}

/**
 * Get file type category based on MIME type
 * @param {string} mimeType - The MIME type
 * @returns {string} - File category (image, document, video, audio, other)
 */
export const getFileCategory = (mimeType) => {
  if (!mimeType) return 'other'
  
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('pdf') || 
      mimeType.includes('document') || 
      mimeType.includes('text') ||
      mimeType.includes('spreadsheet') ||
      mimeType.includes('presentation')) {
    return 'document'
  }
  
  return 'other'
}

/**
 * Create a preview URL for a file
 * @param {File} file - The file to create preview for
 * @returns {string|null} - Preview URL or null if not supported
 */
export const createFilePreview = (file) => {
  if (!file) return null
  
  // Only create previews for images
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file)
  }
  
  return null
}

/**
 * Revoke a preview URL to free memory
 * @param {string} url - The URL to revoke
 */
export const revokeFilePreview = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Convert file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

/**
 * Read file as text
 * @param {File} file - The file to read
 * @returns {Promise<string>} - File content as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

/**
 * Parse CSV file content
 * @param {File} file - The CSV file to parse
 * @param {string} delimiter - CSV delimiter (default: ',')
 * @returns {Promise<Array>} - Parsed CSV data as array of objects
 */
export const parseCSVFile = async (file, delimiter = ',') => {
  try {
    const text = await readFileAsText(file)
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) return []
    
    // Get headers from first line
    const headers = lines[0].split(delimiter).map(header => header.trim().replace(/"/g, ''))
    
    // Parse data rows
    const data = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter).map(value => value.trim().replace(/"/g, ''))
      const row = {}
      
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      
      data.push(row)
    }
    
    return data
  } catch (error) {
    throw new Error(`CSV parsing error: ${error.message}`)
  }
}

/**
 * Validate CSV file structure for student list import
 * @param {Array} csvData - Parsed CSV data
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateStudentCSV = (csvData) => {
  const errors = []
  const requiredFields = ['name', 'studentId']
  
  if (!Array.isArray(csvData) || csvData.length === 0) {
    errors.push('CSV dosyası boş veya geçersiz')
    return { isValid: false, errors }
  }
  
  // Check if required fields exist
  const firstRow = csvData[0]
  const availableFields = Object.keys(firstRow).map(key => key.toLowerCase())
  
  requiredFields.forEach(field => {
    if (!availableFields.includes(field.toLowerCase())) {
      errors.push(`Gerekli alan eksik: ${field}`)
    }
  })
  
  // Validate data rows
  csvData.forEach((row, index) => {
    const rowNumber = index + 2 // +2 because index starts at 0 and we skip header
    
    // Check for required fields
    if (!row.name || row.name.trim() === '') {
      errors.push(`Satır ${rowNumber}: İsim alanı boş`)
    }
    
    if (!row.studentId || row.studentId.trim() === '') {
      errors.push(`Satır ${rowNumber}: Öğrenci numarası boş`)
    }
  })
  
  // Check for duplicate student IDs
  const studentIds = csvData.map(row => row.studentId).filter(id => id)
  const duplicateIds = studentIds.filter((id, index) => studentIds.indexOf(id) !== index)
  
  if (duplicateIds.length > 0) {
    errors.push(`Tekrarlanan öğrenci numaraları: ${[...new Set(duplicateIds)].join(', ')}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Common file type configurations
 */
export const FILE_TYPES = {
  IMAGES: {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },
  DOCUMENTS: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt']
  },
  SPREADSHEETS: {
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/csv': ['.csv']
  },
  ALL_DOCUMENTS: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/csv': ['.csv'],
    'text/plain': ['.txt']
  }
}

/**
 * Common file size limits
 */
export const FILE_SIZE_LIMITS = {
  SMALL: 1 * 1024 * 1024,    // 1MB
  MEDIUM: 5 * 1024 * 1024,   // 5MB
  LARGE: 10 * 1024 * 1024,   // 10MB
  XLARGE: 50 * 1024 * 1024   // 50MB
}