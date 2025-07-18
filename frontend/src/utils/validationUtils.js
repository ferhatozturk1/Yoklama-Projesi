/**
 * Validation utility functions for the teacher attendance system
 */

/**
 * Validate Turkish TC number using the official algorithm
 * @param {string} tcNumber - TC number to validate
 * @returns {boolean} - Whether the TC number is valid
 */
export const validateTCNumber = (tcNumber) => {
  if (!tcNumber || typeof tcNumber !== 'string') return false
  
  // Remove any non-digit characters
  const cleaned = tcNumber.replace(/\D/g, '')
  
  // Check length
  if (cleaned.length !== 11) return false
  
  // First digit cannot be 0
  if (cleaned[0] === '0') return false
  
  // Convert to array of numbers
  const digits = cleaned.split('').map(Number)
  
  // Calculate checksums
  const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
  const sum2 = digits[1] + digits[3] + digits[5] + digits[7]
  
  const check1 = (sum1 * 7 - sum2) % 10
  const check2 = (sum1 + sum2 + digits[9]) % 10
  
  return check1 === digits[9] && check2 === digits[10]
}

/**
 * Validate Turkish phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return false
  
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  // Check Turkish mobile number patterns
  const patterns = [
    /^(\+90|0)?[5][0-9]{9}$/, // Turkish mobile
    /^(\+90|0)?[2-4][0-9]{8}$/ // Turkish landline
  ]
  
  return patterns.some(pattern => pattern.test(cleaned))
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.toLowerCase())
}

/**
 * Validate student ID
 * @param {string} studentId - Student ID to validate
 * @returns {boolean} - Whether the student ID is valid
 */
export const validateStudentId = (studentId) => {
  if (!studentId || typeof studentId !== 'string') return false
  
  // Student ID should be 4-10 digits
  const studentIdRegex = /^[0-9]{4,10}$/
  return studentIdRegex.test(studentId)
}

/**
 * Validate course code (e.g., CSE101, MATH201)
 * @param {string} courseCode - Course code to validate
 * @returns {boolean} - Whether the course code is valid
 */
export const validateCourseCode = (courseCode) => {
  if (!courseCode || typeof courseCode !== 'string') return false
  
  // Course code should be 2-4 letters followed by 3 digits
  const courseCodeRegex = /^[A-Z]{2,4}[0-9]{3}$/
  return courseCodeRegex.test(courseCode.toUpperCase())
}

/**
 * Validate academic year format (e.g., 2023-2024)
 * @param {string} academicYear - Academic year to validate
 * @returns {boolean} - Whether the academic year is valid
 */
export const validateAcademicYear = (academicYear) => {
  if (!academicYear || typeof academicYear !== 'string') return false
  
  const yearRegex = /^[0-9]{4}-[0-9]{4}$/
  if (!yearRegex.test(academicYear)) return false
  
  const [year1, year2] = academicYear.split('-').map(Number)
  return year2 === year1 + 1 && year1 >= 2000 && year1 <= 2100
}

/**
 * Validate time format (HH:MM)
 * @param {string} time - Time to validate
 * @returns {boolean} - Whether the time is valid
 */
export const validateTime = (time) => {
  if (!time || typeof time !== 'string') return false
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

/**
 * Validate date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {boolean} - Whether the date range is valid
 */
export const validateDateRange = (startDate, endDate) => {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false
    
    return end >= start
  } catch {
    return false
  }
}

/**
 * Validate file type against allowed types
 * @param {File} file - File to validate
 * @param {Array<string>} allowedTypes - Array of allowed MIME types
 * @returns {boolean} - Whether the file type is allowed
 */
export const validateFileType = (file, allowedTypes = []) => {
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
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} - Whether the file size is valid
 */
export const validateFileSize = (file, maxSize) => {
  if (!file || !maxSize) return false
  return file.size <= maxSize
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with score and feedback
 */
export const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return { score: 0, feedback: ['Şifre gereklidir'] }
  }
  
  const feedback = []
  let score = 0
  
  // Length check
  if (password.length < 8) {
    feedback.push('En az 8 karakter olmalıdır')
  } else {
    score += 1
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('En az bir küçük harf içermelidir')
  } else {
    score += 1
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('En az bir büyük harf içermelidir')
  } else {
    score += 1
  }
  
  // Number check
  if (!/\d/.test(password)) {
    feedback.push('En az bir rakam içermelidir')
  } else {
    score += 1
  }
  
  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('En az bir özel karakter içermelidir')
  } else {
    score += 1
  }
  
  // Length bonus
  if (password.length >= 12) {
    score += 1
  }
  
  return {
    score: Math.min(score, 5),
    feedback: feedback.length > 0 ? feedback : ['Güçlü şifre'],
    isValid: score >= 4
  }
}

/**
 * Validate academic calendar dates
 * @param {Object} calendar - Calendar object with dates
 * @returns {Object} - Validation result
 */
export const validateAcademicCalendar = (calendar) => {
  const errors = []
  
  if (!calendar.semesterStart || !calendar.semesterEnd) {
    errors.push('Dönem başlangıç ve bitiş tarihleri gereklidir')
    return { isValid: false, errors }
  }
  
  const start = new Date(calendar.semesterStart)
  const end = new Date(calendar.semesterEnd)
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    errors.push('Geçersiz tarih formatı')
    return { isValid: false, errors }
  }
  
  if (end <= start) {
    errors.push('Dönem bitiş tarihi başlangıç tarihinden sonra olmalıdır')
  }
  
  // Check semester duration (should be reasonable)
  const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  if (diffMonths < 3 || diffMonths > 6) {
    errors.push('Dönem süresi 3-6 ay arasında olmalıdır')
  }
  
  // Validate holidays
  if (calendar.holidays && Array.isArray(calendar.holidays)) {
    calendar.holidays.forEach((holiday, index) => {
      if (!holiday.name || !holiday.startDate || !holiday.endDate) {
        errors.push(`${index + 1}. tatil için tüm alanlar doldurulmalıdır`)
        return
      }
      
      const holidayStart = new Date(holiday.startDate)
      const holidayEnd = new Date(holiday.endDate)
      
      if (isNaN(holidayStart.getTime()) || isNaN(holidayEnd.getTime())) {
        errors.push(`${index + 1}. tatil için geçersiz tarih`)
        return
      }
      
      if (holidayEnd < holidayStart) {
        errors.push(`${index + 1}. tatil bitiş tarihi başlangıç tarihinden sonra olmalıdır`)
      }
      
      // Check if holiday is within semester
      if (holidayStart < start || holidayEnd > end) {
        errors.push(`${index + 1}. tatil dönem tarihleri içinde olmalıdır`)
      }
    })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate schedule entry for conflicts
 * @param {Object} newEntry - New schedule entry
 * @param {Array} existingSchedule - Existing schedule entries
 * @returns {Object} - Validation result
 */
export const validateScheduleConflict = (newEntry, existingSchedule = []) => {
  const conflicts = []
  
  if (!newEntry.day || !newEntry.startTime || !newEntry.endTime) {
    return { hasConflict: true, conflicts: ['Eksik bilgi'] }
  }
  
  const newStart = new Date(`2000-01-01 ${newEntry.startTime}`)
  const newEnd = new Date(`2000-01-01 ${newEntry.endTime}`)
  
  if (newEnd <= newStart) {
    return { hasConflict: true, conflicts: ['Bitiş saati başlangıç saatinden sonra olmalıdır'] }
  }
  
  existingSchedule.forEach(entry => {
    if (entry.day === newEntry.day && entry.id !== newEntry.id) {
      const existingStart = new Date(`2000-01-01 ${entry.startTime}`)
      const existingEnd = new Date(`2000-01-01 ${entry.endTime}`)
      
      // Check for time overlap
      if ((newStart < existingEnd && newEnd > existingStart)) {
        conflicts.push(`${entry.courseName || 'Bilinmeyen Ders'} (${entry.startTime}-${entry.endTime}) ile çakışma`)
      }
    }
  })
  
  return {
    hasConflict: conflicts.length > 0,
    conflicts
  }
}

/**
 * Validate attendance data
 * @param {Array} attendanceData - Array of attendance records
 * @returns {Object} - Validation result
 */
export const validateAttendanceData = (attendanceData) => {
  const errors = []
  
  if (!Array.isArray(attendanceData)) {
    return { isValid: false, errors: ['Devamsızlık verisi dizi olmalıdır'] }
  }
  
  const validStatuses = ['present', 'absent', 'excused']
  
  attendanceData.forEach((record, index) => {
    if (!record.studentId) {
      errors.push(`${index + 1}. kayıt: Öğrenci ID gereklidir`)
    }
    
    if (!record.status || !validStatuses.includes(record.status)) {
      errors.push(`${index + 1}. kayıt: Geçerli durum gereklidir (present, absent, excused)`)
    }
    
    if (record.notes && record.notes.length > 200) {
      errors.push(`${index + 1}. kayıt: Not çok uzun (max 200 karakter)`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .substring(0, 1000) // Limit length
}

/**
 * Validate and sanitize form data
 * @param {Object} data - Form data to validate
 * @param {Object} schema - Yup schema to validate against
 * @returns {Promise<Object>} - Validation result
 */
export const validateAndSanitizeFormData = async (data, schema) => {
  try {
    // Sanitize string fields
    const sanitizedData = {}
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        sanitizedData[key] = sanitizeInput(data[key])
      } else {
        sanitizedData[key] = data[key]
      }
    })
    
    // Validate with schema
    const validatedData = await schema.validate(sanitizedData, { abortEarly: false })
    
    return {
      isValid: true,
      data: validatedData,
      errors: []
    }
  } catch (error) {
    return {
      isValid: false,
      data: null,
      errors: error.errors || [error.message]
    }
  }
}

/**
 * Get validation error message for a field
 * @param {Object} errors - Formik errors object
 * @param {string} fieldName - Field name to get error for
 * @returns {string|null} - Error message or null
 */
export const getFieldError = (errors, fieldName) => {
  const fieldPath = fieldName.split('.')
  let error = errors
  
  for (const path of fieldPath) {
    if (error && typeof error === 'object') {
      error = error[path]
    } else {
      return null
    }
  }
  
  return typeof error === 'string' ? error : null
}

/**
 * Check if field has error
 * @param {Object} errors - Formik errors object
 * @param {Object} touched - Formik touched object
 * @param {string} fieldName - Field name to check
 * @returns {boolean} - Whether field has error
 */
export const hasFieldError = (errors, touched, fieldName) => {
  const error = getFieldError(errors, fieldName)
  const isTouched = getFieldError(touched, fieldName)
  
  return !!(error && isTouched)
}

/**
 * Format validation errors for display
 * @param {Array} errors - Array of error messages
 * @returns {string} - Formatted error message
 */
export const formatValidationErrors = (errors) => {
  if (!Array.isArray(errors) || errors.length === 0) return ''
  
  if (errors.length === 1) return errors[0]
  
  return errors.map((error, index) => `${index + 1}. ${error}`).join('\n')
}