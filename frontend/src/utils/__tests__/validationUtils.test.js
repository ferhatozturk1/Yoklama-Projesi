import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhoneNumber,
  validateStudentId,
  validateCourseCode,
  validateAcademicYear,
  validateTime,
  validateDateRange,
  validatePasswordStrength,
  sanitizeInput,
  formatValidationErrors
} from '../validationUtils'

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true)
      expect(validateEmail('user-name@domain.com')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('test')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@example')).toBe(false)
      expect(validateEmail('')).toBe(false)
      expect(validateEmail(null)).toBe(false)
    })
  })

  describe('validatePhoneNumber', () => {
    it('should validate correct Turkish phone numbers', () => {
      expect(validatePhoneNumber('05551234567')).toBe(true)
      expect(validatePhoneNumber('+905551234567')).toBe(true)
      expect(validatePhoneNumber('0555 123 45 67')).toBe(true)
      expect(validatePhoneNumber('(0555) 123-4567')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('1234567')).toBe(false)
      expect(validatePhoneNumber('05551')).toBe(false)
      expect(validatePhoneNumber('0555123456789')).toBe(false)
      expect(validatePhoneNumber('')).toBe(false)
      expect(validatePhoneNumber(null)).toBe(false)
    })
  })

  describe('validateStudentId', () => {
    it('should validate correct student IDs', () => {
      expect(validateStudentId('1234')).toBe(true)
      expect(validateStudentId('12345678')).toBe(true)
      expect(validateStudentId('1234567890')).toBe(true)
    })

    it('should reject invalid student IDs', () => {
      expect(validateStudentId('123')).toBe(false)
      expect(validateStudentId('12345678901')).toBe(false)
      expect(validateStudentId('123ABC')).toBe(false)
      expect(validateStudentId('')).toBe(false)
      expect(validateStudentId(null)).toBe(false)
    })
  })

  describe('validateCourseCode', () => {
    it('should validate correct course codes', () => {
      expect(validateCourseCode('CS101')).toBe(true)
      expect(validateCourseCode('MATH101')).toBe(true)
      expect(validateCourseCode('cs101')).toBe(true) // Should convert to uppercase
    })

    it('should reject invalid course codes', () => {
      expect(validateCourseCode('C101')).toBe(false)
      expect(validateCourseCode('CSMATH101')).toBe(false)
      expect(validateCourseCode('CS1')).toBe(false)
      expect(validateCourseCode('CS1234')).toBe(false)
      expect(validateCourseCode('101CS')).toBe(false)
      expect(validateCourseCode('')).toBe(false)
      expect(validateCourseCode(null)).toBe(false)
    })
  })

  describe('validateAcademicYear', () => {
    it('should validate correct academic years', () => {
      expect(validateAcademicYear('2023-2024')).toBe(true)
      expect(validateAcademicYear('2022-2023')).toBe(true)
    })

    it('should reject invalid academic years', () => {
      expect(validateAcademicYear('2023-2025')).toBe(false)
      expect(validateAcademicYear('2023-2022')).toBe(false)
      expect(validateAcademicYear('202-2023')).toBe(false)
      expect(validateAcademicYear('2023/2024')).toBe(false)
      expect(validateAcademicYear('')).toBe(false)
      expect(validateAcademicYear(null)).toBe(false)
    })
  })

  describe('validateTime', () => {
    it('should validate correct time formats', () => {
      expect(validateTime('09:30')).toBe(true)
      expect(validateTime('9:30')).toBe(true)
      expect(validateTime('23:59')).toBe(true)
      expect(validateTime('00:00')).toBe(true)
    })

    it('should reject invalid time formats', () => {
      expect(validateTime('9:60')).toBe(false)
      expect(validateTime('24:00')).toBe(false)
      expect(validateTime('9-30')).toBe(false)
      expect(validateTime('930')).toBe(false)
      expect(validateTime('')).toBe(false)
      expect(validateTime(null)).toBe(false)
    })
  })

  describe('validateDateRange', () => {
    it('should validate correct date ranges', () => {
      expect(validateDateRange('2023-01-01', '2023-01-02')).toBe(true)
      expect(validateDateRange(new Date(2023, 0, 1), new Date(2023, 0, 2))).toBe(true)
      expect(validateDateRange('2023-01-01', '2023-01-01')).toBe(true) // Same day
    })

    it('should reject invalid date ranges', () => {
      expect(validateDateRange('2023-01-02', '2023-01-01')).toBe(false)
      expect(validateDateRange('invalid', '2023-01-01')).toBe(false)
      expect(validateDateRange('2023-01-01', 'invalid')).toBe(false)
      expect(validateDateRange('', '')).toBe(false)
      expect(validateDateRange(null, null)).toBe(false)
    })
  })

  describe('validatePasswordStrength', () => {
    it('should score password strength correctly', () => {
      expect(validatePasswordStrength('password').score).toBeLessThan(4)
      expect(validatePasswordStrength('Password1').score).toBeGreaterThanOrEqual(4)
      expect(validatePasswordStrength('Password1!').score).toBe(5)
    })

    it('should provide appropriate feedback', () => {
      expect(validatePasswordStrength('pass').feedback).toContain(expect.stringContaining('8 karakter'))
      expect(validatePasswordStrength('password').feedback).toContain(expect.stringContaining('büyük harf'))
      expect(validatePasswordStrength('PASSWORD').feedback).toContain(expect.stringContaining('küçük harf'))
      expect(validatePasswordStrength('Password').feedback).toContain(expect.stringContaining('rakam'))
    })

    it('should validate password strength', () => {
      expect(validatePasswordStrength('password').isValid).toBe(false)
      expect(validatePasswordStrength('Password1').isValid).toBe(true)
    })
  })

  describe('sanitizeInput', () => {
    it('should sanitize input strings', () => {
      expect(sanitizeInput(' test ')).toBe('test')
      expect(sanitizeInput('<script>alert("XSS")</script>')).toBe('scriptalert("XSS")script')
      expect(sanitizeInput('"quoted"')).toBe('quoted')
    })

    it('should handle non-string inputs', () => {
      expect(sanitizeInput(null)).toBe('')
      expect(sanitizeInput(undefined)).toBe('')
      expect(sanitizeInput(123)).toBe('')
    })
  })

  describe('formatValidationErrors', () => {
    it('should format single error correctly', () => {
      expect(formatValidationErrors(['Error message'])).toBe('Error message')
    })

    it('should format multiple errors correctly', () => {
      expect(formatValidationErrors(['First error', 'Second error'])).toBe('1. First error\n2. Second error')
    })

    it('should handle empty or invalid inputs', () => {
      expect(formatValidationErrors([])).toBe('')
      expect(formatValidationErrors(null)).toBe('')
      expect(formatValidationErrors(undefined)).toBe('')
    })
  })
})