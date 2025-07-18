import { 
  generateProfilePDF, 
  generateAttendanceReportPDF,
  generateStudentListPDF 
} from '../pdfUtils'
import { 
  exportAttendanceToExcel,
  exportStudentListToExcel,
  createStudentImportTemplate 
} from '../excelUtils'

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFont: jest.fn(),
    setFontSize: jest.fn(),
    text: jest.fn(),
    autoTable: jest.fn(),
    save: jest.fn(),
    output: jest.fn(),
    internal: {
      pageSize: {
        height: 297
      }
    },
    lastAutoTable: {
      finalY: 100
    }
  }))
})

// Mock xlsx
jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
    aoa_to_sheet: jest.fn(() => ({})),
    sheet_to_json: jest.fn(() => []),
    decode_range: jest.fn(() => ({ s: { c: 0 }, e: { c: 5 } })),
    encode_cell: jest.fn(() => 'A1')
  },
  writeFile: jest.fn()
}))

describe('Export Utils', () => {
  describe('PDF Generation', () => {
    const mockProfileData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '05551234567',
      university: 'Test University',
      faculty: 'Test Faculty',
      department: 'Test Department'
    }

    const mockAttendanceData = {
      course: {
        name: 'Test Course',
        code: 'TEST101',
        semester: 'Fall',
        academicYear: '2023-2024'
      },
      sessions: [
        {
          date: '2023-10-01',
          attendances: [
            { studentId: '1', status: 'present' },
            { studentId: '2', status: 'absent' }
          ]
        }
      ],
      students: [
        { id: '1', name: 'Student 1', studentId: '12345' },
        { id: '2', name: 'Student 2', studentId: '12346' }
      ]
    }

    const mockStudentData = {
      course: {
        name: 'Test Course',
        code: 'TEST101'
      },
      students: [
        { studentId: '12345', name: 'Student 1', email: 'student1@test.com' },
        { studentId: '12346', name: 'Student 2', email: 'student2@test.com' }
      ]
    }

    test('should generate profile PDF', () => {
      const doc = generateProfilePDF(mockProfileData)
      expect(doc).toBeDefined()
      expect(doc.setFont).toHaveBeenCalled()
      expect(doc.text).toHaveBeenCalled()
    })

    test('should generate attendance report PDF', () => {
      const doc = generateAttendanceReportPDF(mockAttendanceData)
      expect(doc).toBeDefined()
      expect(doc.setFont).toHaveBeenCalled()
      expect(doc.text).toHaveBeenCalled()
      expect(doc.autoTable).toHaveBeenCalled()
    })

    test('should generate student list PDF', () => {
      const doc = generateStudentListPDF(mockStudentData)
      expect(doc).toBeDefined()
      expect(doc.setFont).toHaveBeenCalled()
      expect(doc.text).toHaveBeenCalled()
      expect(doc.autoTable).toHaveBeenCalled()
    })
  })

  describe('Excel Export', () => {
    const mockAttendanceData = {
      course: {
        name: 'Test Course',
        code: 'TEST101',
        semester: 'Fall',
        academicYear: '2023-2024'
      },
      sessions: [
        {
          date: '2023-10-01',
          attendances: [
            { studentId: '1', status: 'present' },
            { studentId: '2', status: 'absent' }
          ]
        }
      ],
      students: [
        { id: '1', name: 'Student 1', studentId: '12345' },
        { id: '2', name: 'Student 2', studentId: '12346' }
      ]
    }

    const mockStudentData = {
      course: {
        name: 'Test Course',
        code: 'TEST101'
      },
      students: [
        { studentId: '12345', name: 'Student 1', email: 'student1@test.com' },
        { studentId: '12346', name: 'Student 2', email: 'student2@test.com' }
      ]
    }

    test('should export attendance to Excel', () => {
      expect(() => exportAttendanceToExcel(mockAttendanceData)).not.toThrow()
    })

    test('should export student list to Excel', () => {
      expect(() => exportStudentListToExcel(mockStudentData)).not.toThrow()
    })

    test('should create student import template', () => {
      expect(() => createStudentImportTemplate()).not.toThrow()
    })
  })
})