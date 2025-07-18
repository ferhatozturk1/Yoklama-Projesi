import {
  validateTCNumber,
  validatePhoneNumber,
  validateEmail,
  validateStudentId,
  validateCourseCode,
  validateAcademicYear,
  validateTime,
  validateDateRange,
  validatePasswordStrength,
  sanitizeInput,
  getFieldError,
  hasFieldError
} from '../validationUtils'

import {
  validateAcademicDate,
  validateSessionTiming,
  validateAttendanceRequirement,
  ACADEMIC_CONSTANTS
} from '../academicValidations'

import {
  validateFileType,
  validateFileSize,
  getFileValidationConfig,
  FILE_UPLOAD_CONFIGS
} from '../fileValidations'

describe('Validation Utils', () => {
  describe('validateTCNumber', () => {
    test('should validate correct TC numbers', () => {
      // These are example TC numbers for testing (not real)
      expect(validateTCNumber('12345678901')).toBe(false) // Invalid checksum
      expect(validateTCNumber('01234567890')).toBe(false) // Starts with 0
      expect(validateTCNumber('1234567890')).toBe(false) // Too short
      expect(validateTCNumber('123456789012')).toBe(false) // Too long
      expect(validateTCNumber('')).toBe(false) // Empty
      expect(validateTCNumber(null)).toBe(false) // Null
    })

    test('should reject invalid TC numbers', () => {
      expect(validateTCNumber('abc1234567')).toBe(false)
      expect(validateTCNumber('12345')).toBe(false)
      expect(validateTCNumber('0123456789')).toBe(false)
    })
  })

  describe('validatePhoneNumber', () => {
    test('should validate Turkish phone numbers', () => {
      expect(validatePhoneNumber('05551234567')).toBe(true)
      expect(validatePhoneNumber('+905551234567')).toBe(true)
      expect(validatePhoneNumber('5551234567')).toBe(true)
      expect(validatePhoneNumber('0212 123 45 67')).toBe(true) // Landline
    })

    test('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123456')).toBe(false)
      expect(validatePhoneNumber('abc123456')).toBe(false)
      expect(validatePhoneNumber('')).toBe(false)
      expect(validatePhoneNumber(null)).toBe(false)
    })
  })

  describe('validateEmail', () => {
    test('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('test+tag@example.org')).toBe(true)
    })

    test('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('')).toBe(false)
      expect(validateEmail(null)).toBe(false)
    })
  })

  describe('validateStudentId', () => {
    test('should validate student IDs', () => {
      expect(validateStudentId('1234')).toBe(true)
      expect(validateStudentId('12345678')).toBe(true)
      expect(validateStudentId('1234567890')).toBe(true)
    })

    test('should reject invalid student IDs', () => {
      expect(validateStudentId('123')).toBe(false) // Too short
      expect(validateStudentId('12345678901')).toBe(false) // Too long
      expect(validateStudentId('abc123')).toBe(false) // Contains letters
      expect(validateStudentId('')).toBe(false)
    })
  })

  describe('validateCourseCode', () => {
    test('should validate course codes', () => {
      expect(validateCourseCode('CSE101')).toBe(true)
      expect(validateCourseCode('MATH201')).toBe(true)
      expect(validateCourseCode('EE305')).toBe(true)
    })

    test('should reject invalid course codes', () => {
      expect(validateCourseCode('CS1')).toBe(false) // Too short
      expect(validateCourseCode('ABCDE123')).toBe(false) // Too many letters
      expect(validateCourseCode('CSE12')).toBe(false) // Too few digits
      expect(validateCourseCode('123CSE')).toBe(false) // Wrong format
    })
  })

  describe('validateAcademicYear', () => {
    test('should validate academic years', () => {
      expect(validateAcademicYear('2023-2024')).toBe(true)
      expect(validateAcademicYear('2024-2025')).toBe(true)
    })

    test('should reject invalid academic years', () => {
      expect(validateAcademicYear('2023-2025')).toBe(false) // Gap of 2 years
      expect(validateAcademicYear('2024-2023')).toBe(false) // Reverse order
      expect(validateAcademicYear('23-24')).toBe(false) // Wrong format
      expect(validateAcademicYear('2023/2024')).toBe(false) // Wrong separator
    })
  })

  describe('validateTime', () => {
    test('should validate time formats', () => {
      expect(validateTime('09:30')).toBe(true)
      expect(validateTime('23:59')).toBe(true)
      expect(validateTime('00:00')).toBe(true)
    })

    test('should reject invalid time formats', () => {
      expect(validateTime('25:00')).toBe(false) // Invalid hour
      expect(validateTime('12:60')).toBe(false) // Invalid minute
      expect(validateTime('9:30')).toBe(false) // Missing leading zero
      expect(validateTime('09-30')).toBe(false) // Wrong separator
    })
  })

  describe('validatePasswordStrength', () => {
    test('should validate strong passwords', () => {
      const result = validatePasswordStrength('StrongPass123!')
      expect(result.score).toBeGreaterThan(3)
      expect(result.isValid).toBe(true)
    })

    test('should reject weak passwords', () => {
      const result = validatePasswordStrength('weak')
      expect(result.score).toBeLessThan(3)
      expect(result.isValid).toBe(false)
      expect(result.feedback.length).toBeGreaterThan(0)
    })
  })

  describe('sanitizeInput', () => {
    test('should sanitize input strings', () => {
      expect(sanitizeInput('  test  ')).toBe('test')
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
      expect(sanitizeInput('test"quote')).toBe('testquote')
    })

    test('should handle non-string inputs', () => {
      expect(sanitizeInput(null)).toBe('')
      expect(sanitizeInput(123)).toBe('')
      expect(sanitizeInput(undefined)).toBe('')
    })
  })
})

describe('Academic Validations', () => {
  const mockCalendar = {
    semesterStart: '2023-09-01',
    semesterEnd: '2024-01-15',
    holidays: [
      {
        name: 'Cumhuriyet Bayramı',
        startDate: '2023-10-29',
        endDate: '2023-10-29'
      }
    ]
  }

  describe('validateAcademicDate', () => {
    test('should validate dates within semester', () => {
      const result = validateAcademicDate('2023-10-15', mockCalendar)
      expect(result.isValid).toBe(true)
    })

    test('should reject dates outside semester', () => {
      const result = validateAcademicDate('2023-08-15', mockCalendar)
      expect(result.isValid).toBe(false)
      expect(result.type).toBe('out_of_semester')
    })

    test('should reject holiday dates', () => {
      const result = validateAcademicDate('2023-10-29', mockCalendar)
      expect(result.isValid).toBe(false)
      expect(result.type).toBe('holiday')
    })

    test('should reject weekend dates', () => {
      // Assuming 2023-10-14 is a Saturday
      const result = validateAcademicDate('2023-10-14', mockCalendar)
      expect(result.isValid).toBe(false)
      expect(result.type).toBe('weekend')
    })
  })

  describe('validateSessionTiming', () => {
    test('should validate correct session timing', () => {
      const result = validateSessionTiming('09:30', '10:20')
      expect(result.isValid).toBe(true)
    })

    test('should reject sessions with end time before start time', () => {
      const result = validateSessionTiming('10:20', '09:30')
      expect(result.isValid).toBe(false)
    })

    test('should reject sessions that are too short', () => {
      const result = validateSessionTiming('09:30', '09:40', { minDuration: 50 })
      expect(result.isValid).toBe(false)
    })
  })

  describe('validateAttendanceRequirement', () => {
    test('should validate good attendance', () => {
      const records = [
        { status: 'present' },
        { status: 'present' },
        { status: 'present' },
        { status: 'absent' }
      ]
      const result = validateAttendanceRequirement(records)
      expect(result.percentage).toBe(75)
      expect(result.isValid).toBe(true)
    })

    test('should flag poor attendance', () => {
      const records = [
        { status: 'present' },
        { status: 'absent' },
        { status: 'absent' },
        { status: 'absent' }
      ]
      const result = validateAttendanceRequirement(records, { minimumPercentage: 70 })
      expect(result.percentage).toBe(25)
      expect(result.isValid).toBe(false)
      expect(result.status).toBe('critical')
    })
  })
})

describe('File Validations', () => {
  // Mock File constructor for testing
  class MockFile {
    constructor(name, type, size) {
      this.name = name
      this.type = type
      this.size = size
    }
  }

  describe('validateFileType', () => {
    test('should validate correct file types', () => {
      const imageFile = new MockFile('test.jpg', 'image/jpeg', 1000)
      const result = validateFileType(imageFile, ['image/jpeg', 'image/png'])
      expect(result.isValid).toBe(true)
    })

    test('should reject incorrect file types', () => {
      const textFile = new MockFile('test.txt', 'text/plain', 1000)
      const result = validateFileType(textFile, ['image/jpeg', 'image/png'])
      expect(result.isValid).toBe(false)
    })
  })

  describe('validateFileSize', () => {
    test('should validate correct file sizes', () => {
      const smallFile = new MockFile('test.jpg', 'image/jpeg', 1000)
      const result = validateFileSize(smallFile, 5000)
      expect(result.isValid).toBe(true)
    })

    test('should reject oversized files', () => {
      const largeFile = new MockFile('test.jpg', 'image/jpeg', 10000)
      const result = validateFileSize(largeFile, 5000)
      expect(result.isValid).toBe(false)
    })
  })

  describe('getFileValidationConfig', () => {
    test('should return correct config for profile photo', () => {
      const config = getFileValidationConfig('PROFILE_PHOTO')
      expect(config.allowedTypes).toContain('image/jpeg')
      expect(config.maxSize).toBe(2 * 1024 * 1024)
    })

    test('should return default config for unknown context', () => {
      const config = getFileValidationConfig('UNKNOWN')
      expect(config).toBe(FILE_UPLOAD_CONFIGS.GENERAL_DOCUMENT)
    })
  })
})

describe('Utility Functions', () => {
  describe('getFieldError', () => {
    test('should get field error from nested object', () => {
      const errors = {
        user: {
          name: 'Name is required',
          email: 'Invalid email'
        }
      }
      expect(getFieldError(errors, 'user.name')).toBe('Name is required')
      expect(getFieldError(errors, 'user.phone')).toBeNull()
    })
  })

  describe('hasFieldError', () => {
    test('should check if field has error and is touched', () => {
      const errors = { name: 'Required' }
      const touched = { name: true }
      
      expect(hasFieldError(errors, touched, 'name')).toBe(true)
      expect(hasFieldError(errors, {}, 'name')).toBe(false)
    })
  })
})