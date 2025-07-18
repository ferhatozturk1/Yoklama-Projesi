import {
  validateFileType,
  validateFileSize,
  formatFileSize,
  getFileExtension,
  getFileCategory,
  validateStudentCSV,
  FILE_TYPES,
  FILE_SIZE_LIMITS
} from '../fileUtils'

// Mock File constructor for testing
class MockFile {
  constructor(name, type, size) {
    this.name = name
    this.type = type
    this.size = size
  }
}

describe('fileUtils', () => {
  describe('validateFileType', () => {
    test('should validate image files correctly', () => {
      const imageFile = new MockFile('test.jpg', 'image/jpeg', 1000)
      expect(validateFileType(imageFile, FILE_TYPES.IMAGES)).toBe(true)
    })

    test('should reject invalid file types', () => {
      const textFile = new MockFile('test.txt', 'text/plain', 1000)
      expect(validateFileType(textFile, FILE_TYPES.IMAGES)).toBe(false)
    })

    test('should handle wildcard MIME types', () => {
      const pngFile = new MockFile('test.png', 'image/png', 1000)
      expect(validateFileType(pngFile, { 'image/*': ['.jpg', '.png'] })).toBe(true)
    })
  })

  describe('validateFileSize', () => {
    test('should validate file size correctly', () => {
      const smallFile = new MockFile('test.jpg', 'image/jpeg', 1000)
      expect(validateFileSize(smallFile, FILE_SIZE_LIMITS.SMALL)).toBe(true)
    })

    test('should reject oversized files', () => {
      const largeFile = new MockFile('test.jpg', 'image/jpeg', 10 * 1024 * 1024)
      expect(validateFileSize(largeFile, FILE_SIZE_LIMITS.SMALL)).toBe(false)
    })
  })

  describe('formatFileSize', () => {
    test('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })
  })

  describe('getFileExtension', () => {
    test('should extract file extension correctly', () => {
      expect(getFileExtension('test.jpg')).toBe('jpg')
      expect(getFileExtension('document.pdf')).toBe('pdf')
      expect(getFileExtension('file.name.with.dots.txt')).toBe('txt')
    })

    test('should handle files without extension', () => {
      expect(getFileExtension('filename')).toBe('filename')
      expect(getFileExtension('')).toBe('')
    })
  })

  describe('getFileCategory', () => {
    test('should categorize files correctly', () => {
      expect(getFileCategory('image/jpeg')).toBe('image')
      expect(getFileCategory('video/mp4')).toBe('video')
      expect(getFileCategory('audio/mp3')).toBe('audio')
      expect(getFileCategory('application/pdf')).toBe('document')
      expect(getFileCategory('application/unknown')).toBe('other')
    })
  })

  describe('validateStudentCSV', () => {
    test('should validate correct CSV data', () => {
      const validData = [
        { name: 'Ahmet Yılmaz', studentId: '12345', email: 'ahmet@test.com' },
        { name: 'Ayşe Demir', studentId: '12346', email: 'ayse@test.com' }
      ]
      
      const result = validateStudentCSV(validData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('should detect missing required fields', () => {
      const invalidData = [
        { name: 'Ahmet Yılmaz', email: 'ahmet@test.com' }, // missing studentId
        { studentId: '12346', email: 'ayse@test.com' } // missing name
      ]
      
      const result = validateStudentCSV(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    test('should detect duplicate student IDs', () => {
      const duplicateData = [
        { name: 'Ahmet Yılmaz', studentId: '12345' },
        { name: 'Ayşe Demir', studentId: '12345' } // duplicate ID
      ]
      
      const result = validateStudentCSV(duplicateData)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('Tekrarlanan'))).toBe(true)
    })

    test('should handle empty data', () => {
      const result = validateStudentCSV([])
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('boş'))).toBe(true)
    })
  })
})