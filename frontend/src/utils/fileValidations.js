/**
 * File upload validation utilities
 */

/**
 * File type configurations for different upload contexts
 */
export const FILE_UPLOAD_CONFIGS = {
  PROFILE_PHOTO: {
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize: 2 * 1024 * 1024, // 2MB
    minDimensions: { width: 100, height: 100 },
    maxDimensions: { width: 2000, height: 2000 },
    aspectRatio: { min: 0.5, max: 2.0 }
  },
  
  STUDENT_LIST: {
    allowedTypes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    requiredColumns: ['name', 'studentId'],
    optionalColumns: ['email', 'phone']
  },
  
  ACADEMIC_CALENDAR: {
    allowedTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ],
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  
  COURSE_MATERIALS: {
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    maxSize: 50 * 1024 * 1024 // 50MB
  },
  
  GENERAL_DOCUMENT: {
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    maxSize: 10 * 1024 * 1024 // 10MB
  }
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {Object} - Validation result
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) {
    return { isValid: false, error: 'Dosya seçilmedi' }
  }
  
  if (!allowedTypes || allowedTypes.length === 0) {
    return { isValid: true }
  }
  
  const isAllowed = allowedTypes.some(type => {
    if (type.includes('*')) {
      const baseType = type.split('/')[0]
      return file.type.startsWith(baseType + '/')
    }
    return file.type === type
  })
  
  if (!isAllowed) {
    const allowedExtensions = allowedTypes.map(type => {
      const extensions = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'application/pdf': '.pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
        'application/vnd.ms-excel': '.xls',
        'text/csv': '.csv',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
      }
      return extensions[type] || type
    })
    
    return { 
      isValid: false, 
      error: `Desteklenen dosya türleri: ${allowedExtensions.join(', ')}` 
    }
  }
  
  return { isValid: true }
}

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {Object} - Validation result
 */
export const validateFileSize = (file, maxSize) => {
  if (!file) {
    return { isValid: false, error: 'Dosya seçilmedi' }
  }
  
  if (!maxSize) {
    return { isValid: true }
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
    
    return { 
      isValid: false, 
      error: `Dosya boyutu çok büyük (${fileSizeMB}MB). Maksimum: ${maxSizeMB}MB` 
    }
  }
  
  return { isValid: true }
}

/**
 * Validate image dimensions
 * @param {File} file - Image file to validate
 * @param {Object} constraints - Dimension constraints
 * @returns {Promise<Object>} - Validation result
 */
export const validateImageDimensions = (file, constraints = {}) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve({ isValid: true })
      return
    }
    
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      
      const { width, height } = img
      const { minDimensions, maxDimensions, aspectRatio } = constraints
      
      // Check minimum dimensions
      if (minDimensions) {
        if (width < minDimensions.width || height < minDimensions.height) {
          resolve({
            isValid: false,
            error: `Minimum boyut: ${minDimensions.width}x${minDimensions.height}px (Mevcut: ${width}x${height}px)`
          })
          return
        }
      }
      
      // Check maximum dimensions
      if (maxDimensions) {
        if (width > maxDimensions.width || height > maxDimensions.height) {
          resolve({
            isValid: false,
            error: `Maksimum boyut: ${maxDimensions.width}x${maxDimensions.height}px (Mevcut: ${width}x${height}px)`
          })
          return
        }
      }
      
      // Check aspect ratio
      if (aspectRatio) {
        const ratio = width / height
        if (ratio < aspectRatio.min || ratio > aspectRatio.max) {
          resolve({
            isValid: false,
            error: `Görüntü oranı ${aspectRatio.min.toFixed(1)}-${aspectRatio.max.toFixed(1)} arasında olmalıdır`
          })
          return
        }
      }
      
      resolve({ isValid: true, dimensions: { width, height } })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ isValid: false, error: 'Görüntü dosyası okunamadı' })
    }
    
    img.src = url
  })
}

/**
 * Validate CSV/Excel file structure
 * @param {File} file - File to validate
 * @param {Object} config - Validation configuration
 * @returns {Promise<Object>} - Validation result
 */
export const validateSpreadsheetStructure = async (file, config = {}) => {
  const { requiredColumns = [], optionalColumns = [] } = config
  
  if (!file) {
    return { isValid: false, error: 'Dosya seçilmedi' }
  }
  
  try {
    let data
    
    if (file.type === 'text/csv') {
      data = await parseCSVFile(file)
    } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
      data = await parseExcelFile(file)
    } else {
      return { isValid: false, error: 'Desteklenmeyen dosya türü' }
    }
    
    if (!data || data.length === 0) {
      return { isValid: false, error: 'Dosya boş veya okunamadı' }
    }
    
    // Check required columns
    const firstRow = data[0]
    const availableColumns = Object.keys(firstRow).map(col => col.toLowerCase().trim())
    
    const missingColumns = requiredColumns.filter(col => 
      !availableColumns.includes(col.toLowerCase())
    )
    
    if (missingColumns.length > 0) {
      return {
        isValid: false,
        error: `Gerekli sütunlar eksik: ${missingColumns.join(', ')}`
      }
    }
    
    // Validate data rows
    const errors = []
    data.forEach((row, index) => {
      requiredColumns.forEach(col => {
        const value = row[col] || row[col.toLowerCase()] || row[col.toUpperCase()]
        if (!value || value.toString().trim() === '') {
          errors.push(`Satır ${index + 2}: ${col} alanı boş`)
        }
      })
    })
    
    if (errors.length > 0) {
      return {
        isValid: false,
        error: `Veri hataları:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}`
      }
    }
    
    return {
      isValid: true,
      data,
      rowCount: data.length,
      columns: availableColumns
    }
    
  } catch (error) {
    return {
      isValid: false,
      error: `Dosya işleme hatası: ${error.message}`
    }
  }
}

/**
 * Parse CSV file
 * @param {File} file - CSV file
 * @returns {Promise<Array>} - Parsed data
 */
const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length === 0) {
          resolve([])
          return
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
        const data = []
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
          const row = {}
          
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          
          data.push(row)
        }
        
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Dosya okunamadı'))
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * Parse Excel file (simplified - would need xlsx library in real implementation)
 * @param {File} file - Excel file
 * @returns {Promise<Array>} - Parsed data
 */
const parseExcelFile = (file) => {
  // This is a placeholder - in real implementation, you would use xlsx library
  return new Promise((resolve, reject) => {
    reject(new Error('Excel parsing requires xlsx library'))
  })
}

/**
 * Validate multiple files
 * @param {FileList|Array} files - Files to validate
 * @param {Object} config - Validation configuration
 * @returns {Promise<Object>} - Validation result
 */
export const validateMultipleFiles = async (files, config = {}) => {
  const fileArray = Array.from(files)
  const results = []
  const errors = []
  
  if (config.maxFiles && fileArray.length > config.maxFiles) {
    return {
      isValid: false,
      error: `Maksimum ${config.maxFiles} dosya seçilebilir`
    }
  }
  
  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i]
    const result = await validateSingleFile(file, config)
    
    results.push({
      file,
      ...result
    })
    
    if (!result.isValid) {
      errors.push(`${file.name}: ${result.error}`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    results,
    errors: errors.length > 0 ? errors : null
  }
}

/**
 * Validate single file with complete configuration
 * @param {File} file - File to validate
 * @param {Object} config - Validation configuration
 * @returns {Promise<Object>} - Validation result
 */
export const validateSingleFile = async (file, config = {}) => {
  const {
    allowedTypes,
    maxSize,
    minDimensions,
    maxDimensions,
    aspectRatio,
    requiredColumns,
    optionalColumns
  } = config
  
  // Basic file validation
  if (!file) {
    return { isValid: false, error: 'Dosya seçilmedi' }
  }
  
  // File type validation
  if (allowedTypes) {
    const typeValidation = validateFileType(file, allowedTypes)
    if (!typeValidation.isValid) {
      return typeValidation
    }
  }
  
  // File size validation
  if (maxSize) {
    const sizeValidation = validateFileSize(file, maxSize)
    if (!sizeValidation.isValid) {
      return sizeValidation
    }
  }
  
  // Image dimension validation
  if (file.type.startsWith('image/') && (minDimensions || maxDimensions || aspectRatio)) {
    const dimensionValidation = await validateImageDimensions(file, {
      minDimensions,
      maxDimensions,
      aspectRatio
    })
    if (!dimensionValidation.isValid) {
      return dimensionValidation
    }
  }
  
  // Spreadsheet structure validation
  if ((file.type.includes('spreadsheet') || file.type.includes('excel') || file.type === 'text/csv') 
      && (requiredColumns || optionalColumns)) {
    const structureValidation = await validateSpreadsheetStructure(file, {
      requiredColumns,
      optionalColumns
    })
    if (!structureValidation.isValid) {
      return structureValidation
    }
    
    return {
      isValid: true,
      data: structureValidation.data,
      rowCount: structureValidation.rowCount
    }
  }
  
  return { isValid: true }
}

/**
 * Get file validation configuration by context
 * @param {string} context - Upload context
 * @returns {Object} - Validation configuration
 */
export const getFileValidationConfig = (context) => {
  return FILE_UPLOAD_CONFIGS[context] || FILE_UPLOAD_CONFIGS.GENERAL_DOCUMENT
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file icon class based on file type
 * @param {string} mimeType - File MIME type
 * @returns {string} - Icon class or emoji
 */
export const getFileIcon = (mimeType) => {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType === 'application/pdf') return '📄'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊'
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊'
  if (mimeType === 'text/csv') return '📋'
  return '📁'
}

export default {
  validateFileType,
  validateFileSize,
  validateImageDimensions,
  validateSpreadsheetStructure,
  validateMultipleFiles,
  validateSingleFile,
  getFileValidationConfig,
  formatFileSize,
  getFileIcon,
  FILE_UPLOAD_CONFIGS
}