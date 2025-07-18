import * as Yup from 'yup'

/**
 * Validation schemas for all forms in the application
 */

// Custom validation messages in Turkish
const messages = {
  required: 'Bu alan zorunludur',
  email: 'Geçerli bir e-posta adresi giriniz',
  min: 'En az ${min} karakter olmalıdır',
  max: 'En fazla ${max} karakter olmalıdır',
  minNumber: 'En az ${min} olmalıdır',
  maxNumber: 'En fazla ${max} olmalıdır',
  phone: 'Geçerli bir telefon numarası giriniz',
  tcNumber: 'Geçerli bir TC kimlik numarası giriniz',
  studentId: 'Geçerli bir öğrenci numarası giriniz',
  password: 'Şifre en az 8 karakter olmalı ve en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
  passwordConfirm: 'Şifreler eşleşmiyor',
  date: 'Geçerli bir tarih giriniz',
  url: 'Geçerli bir URL giriniz',
  positive: 'Pozitif bir sayı giriniz',
  integer: 'Tam sayı giriniz'
}

// Custom validation methods
const customValidations = {
  // Turkish phone number validation
  phone: Yup.string().matches(
    /^(\+90|0)?[5][0-9]{9}$/,
    messages.phone
  ),
  
  // Turkish TC number validation
  tcNumber: Yup.string().matches(
    /^[1-9][0-9]{10}$/,
    messages.tcNumber
  ).test('tc-validation', messages.tcNumber, function(value) {
    if (!value) return true // Let required handle empty values
    
    // TC number algorithm validation
    if (value.length !== 11) return false
    
    const digits = value.split('').map(Number)
    const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7]
    const check1 = (sum1 * 7 - sum2) % 10
    const check2 = (sum1 + sum2 + digits[9]) % 10
    
    return check1 === digits[9] && check2 === digits[10]
  }),
  
  // Student ID validation
  studentId: Yup.string().matches(
    /^[0-9]{4,10}$/,
    messages.studentId
  ),
  
  // Strong password validation
  strongPassword: Yup.string()
    .min(8, messages.min)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      messages.password
    ),
  
  // Academic year validation (e.g., 2023-2024)
  academicYear: Yup.string().matches(
    /^[0-9]{4}-[0-9]{4}$/,
    'Akademik yıl formatı: YYYY-YYYY'
  ).test('year-sequence', 'İkinci yıl birinci yıldan bir fazla olmalıdır', function(value) {
    if (!value) return true
    const [year1, year2] = value.split('-').map(Number)
    return year2 === year1 + 1
  }),
  
  // Course code validation (e.g., CSE101, MATH201)
  courseCode: Yup.string().matches(
    /^[A-Z]{2,4}[0-9]{3}$/,
    'Ders kodu formatı: ABC123'
  ),
  
  // Time validation (HH:MM format)
  time: Yup.string().matches(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    'Saat formatı: SS:DD'
  )
}

// Authentication schemas
export const loginSchema = Yup.object({
  email: Yup.string()
    .email(messages.email)
    .required(messages.required),
  password: Yup.string()
    .min(6, messages.min)
    .required(messages.required)
})

export const registerSchema = Yup.object({
  // Personal Information
  name: Yup.string()
    .min(2, messages.min)
    .max(100, messages.max)
    .required(messages.required),
  email: Yup.string()
    .email(messages.email)
    .required(messages.required),
  password: customValidations.strongPassword.required(messages.required),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], messages.passwordConfirm)
    .required(messages.required),
  phone: customValidations.phone.required(messages.required),
  birthDate: Yup.date()
    .max(new Date(), 'Doğum tarihi bugünden sonra olamaz')
    .required(messages.required),
  tcNumber: customValidations.tcNumber.required(messages.required),
  address: Yup.string()
    .min(10, messages.min)
    .max(500, messages.max)
    .required(messages.required),
  
  // Academic Information
  university: Yup.string()
    .min(2, messages.min)
    .max(200, messages.max)
    .required(messages.required),
  faculty: Yup.string()
    .min(2, messages.min)
    .max(200, messages.max)
    .required(messages.required),
  department: Yup.string()
    .min(2, messages.min)
    .max(200, messages.max)
    .required(messages.required),
  title: Yup.string()
    .min(2, messages.min)
    .max(100, messages.max)
    .required(messages.required),
  registrationNumber: Yup.string()
    .min(3, messages.min)
    .max(20, messages.max)
    .required(messages.required),
  officeNumber: Yup.string()
    .max(20, messages.max)
})

// Profile schemas
export const profileUpdateSchema = Yup.object({
  name: Yup.string()
    .min(2, messages.min)
    .max(100, messages.max)
    .required(messages.required),
  phone: customValidations.phone.required(messages.required),
  address: Yup.string()
    .min(10, messages.min)
    .max(500, messages.max)
    .required(messages.required),
  university: Yup.string()
    .min(2, messages.min)
    .max(200, messages.max)
    .required(messages.required),
  faculty: Yup.string()
    .min(2, messages.min)
    .max(200, messages.max)
    .required(messages.required),
  department: Yup.string()
    .min(2, messages.min)
    .max(200, messages.max)
    .required(messages.required),
  title: Yup.string()
    .min(2, messages.min)
    .max(100, messages.max)
    .required(messages.required),
  officeNumber: Yup.string()
    .max(20, messages.max)
})

export const passwordChangeSchema = Yup.object({
  currentPassword: Yup.string()
    .required(messages.required),
  newPassword: customValidations.strongPassword.required(messages.required),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], messages.passwordConfirm)
    .required(messages.required)
})

// Course schemas
export const courseCreateSchema = Yup.object({
  name: Yup.string()
    .min(2, messages.min)
    .max(200, messages.max)
    .required(messages.required),
  code: customValidations.courseCode.required(messages.required),
  credits: Yup.number()
    .min(1, messages.minNumber)
    .max(10, messages.maxNumber)
    .integer(messages.integer)
    .required(messages.required),
  ects: Yup.number()
    .min(1, messages.minNumber)
    .max(30, messages.maxNumber)
    .integer(messages.integer)
    .required(messages.required),
  semester: Yup.string()
    .oneOf(['Fall', 'Spring', 'Summer'], 'Geçerli bir dönem seçiniz')
    .required(messages.required),
  academicYear: customValidations.academicYear.required(messages.required),
  type: Yup.string()
    .oneOf(['Mandatory', 'Elective', 'Optional'], 'Geçerli bir ders türü seçiniz')
    .required(messages.required),
  description: Yup.string()
    .max(1000, messages.max)
})

export const courseUpdateSchema = courseCreateSchema

// Student schemas
export const studentCreateSchema = Yup.object({
  name: Yup.string()
    .min(2, messages.min)
    .max(100, messages.max)
    .required(messages.required),
  studentId: customValidations.studentId.required(messages.required),
  email: Yup.string()
    .email(messages.email),
  phone: customValidations.phone
})

export const studentUpdateSchema = studentCreateSchema

export const studentBulkUploadSchema = Yup.object({
  file: Yup.mixed()
    .required('Dosya seçimi zorunludur')
    .test('fileType', 'Sadece Excel (.xlsx) veya CSV dosyaları kabul edilir', (value) => {
      if (!value) return false
      const supportedFormats = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
      return supportedFormats.includes(value.type)
    })
    .test('fileSize', 'Dosya boyutu 5MB\'dan küçük olmalıdır', (value) => {
      if (!value) return false
      return value.size <= 5 * 1024 * 1024 // 5MB
    })
})

// Schedule schemas
export const scheduleEntrySchema = Yup.object({
  courseId: Yup.string().required(messages.required),
  day: Yup.string()
    .oneOf(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 'Geçerli bir gün seçiniz')
    .required(messages.required),
  startTime: customValidations.time.required(messages.required),
  endTime: customValidations.time.required(messages.required),
  room: Yup.string()
    .max(50, messages.max)
}).test('time-order', 'Bitiş saati başlangıç saatinden sonra olmalıdır', function(values) {
  const { startTime, endTime } = values
  if (!startTime || !endTime) return true
  
  const start = new Date(`2000-01-01 ${startTime}`)
  const end = new Date(`2000-01-01 ${endTime}`)
  
  return end > start
})

// Attendance schemas
export const sessionStartSchema = Yup.object({
  courseId: Yup.string().required(messages.required),
  date: Yup.date()
    .max(new Date(), 'Gelecek tarih seçilemez')
    .required(messages.required),
  startTime: customValidations.time.required(messages.required),
  endTime: customValidations.time.required(messages.required),
  type: Yup.string()
    .oneOf(['regular', 'makeup'], 'Geçerli bir ders türü seçiniz')
    .required(messages.required),
  notes: Yup.string()
    .max(500, messages.max)
}).test('time-order', 'Bitiş saati başlangıç saatinden sonra olmalıdır', function(values) {
  const { startTime, endTime } = values
  if (!startTime || !endTime) return true
  
  const start = new Date(`2000-01-01 ${startTime}`)
  const end = new Date(`2000-01-01 ${endTime}`)
  
  return end > start
})

export const attendanceUpdateSchema = Yup.object({
  attendances: Yup.array().of(
    Yup.object({
      studentId: Yup.string().required(messages.required),
      status: Yup.string()
        .oneOf(['present', 'absent', 'excused'], 'Geçerli bir durum seçiniz')
        .required(messages.required),
      notes: Yup.string()
        .max(200, messages.max)
    })
  ).required(messages.required)
})

// File upload schemas
export const fileUploadSchema = Yup.object({
  file: Yup.mixed()
    .required('Dosya seçimi zorunludur')
    .test('fileSize', 'Dosya boyutu çok büyük', function(value) {
      const maxSize = this.options.context?.maxSize || 5 * 1024 * 1024 // Default 5MB
      if (!value) return false
      return value.size <= maxSize
    })
    .test('fileType', 'Desteklenmeyen dosya türü', function(value) {
      const allowedTypes = this.options.context?.allowedTypes || []
      if (!value || allowedTypes.length === 0) return true
      return allowedTypes.includes(value.type)
    })
})

// Search and filter schemas
export const searchSchema = Yup.object({
  query: Yup.string()
    .max(100, messages.max),
  filters: Yup.object({
    semester: Yup.string(),
    academicYear: Yup.string(),
    courseType: Yup.string(),
    status: Yup.string()
  })
})

export const dateRangeSchema = Yup.object({
  startDate: Yup.date()
    .required(messages.required),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır')
    .required(messages.required)
})

// Export schemas
export const exportConfigSchema = Yup.object({
  format: Yup.string()
    .oneOf(['pdf', 'excel', 'both'], 'Geçerli bir format seçiniz')
    .required(messages.required),
  dateRange: dateRangeSchema.when('includeFilters', {
    is: true,
    then: (schema) => schema.required('Tarih aralığı zorunludur'),
    otherwise: (schema) => schema.notRequired()
  }),
  includeFilters: Yup.boolean(),
  includeStatistics: Yup.boolean(),
  filename: Yup.string()
    .max(100, messages.max)
})

// Settings schemas
export const notificationSettingsSchema = Yup.object({
  emailNotifications: Yup.boolean(),
  pushNotifications: Yup.boolean(),
  reminderTime: Yup.number()
    .min(5, 'En az 5 dakika olmalıdır')
    .max(1440, 'En fazla 1440 dakika (24 saat) olmalıdır')
    .integer(messages.integer)
})

export const academicCalendarSchema = Yup.object({
  name: Yup.string()
    .min(2, messages.min)
    .max(100, messages.max)
    .required(messages.required),
  academicYear: customValidations.academicYear.required(messages.required),
  semesterStart: Yup.date()
    .required(messages.required),
  semesterEnd: Yup.date()
    .min(Yup.ref('semesterStart'), 'Dönem bitiş tarihi başlangıç tarihinden sonra olmalıdır')
    .required(messages.required),
  holidays: Yup.array().of(
    Yup.object({
      name: Yup.string().required(messages.required),
      startDate: Yup.date().required(messages.required),
      endDate: Yup.date()
        .min(Yup.ref('startDate'), 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır')
        .required(messages.required)
    })
  )
})

// Export all schemas
export default {
  // Authentication
  loginSchema,
  registerSchema,
  
  // Profile
  profileUpdateSchema,
  passwordChangeSchema,
  
  // Course
  courseCreateSchema,
  courseUpdateSchema,
  
  // Student
  studentCreateSchema,
  studentUpdateSchema,
  studentBulkUploadSchema,
  
  // Schedule
  scheduleEntrySchema,
  
  // Attendance
  sessionStartSchema,
  attendanceUpdateSchema,
  
  // File upload
  fileUploadSchema,
  
  // Search and filters
  searchSchema,
  dateRangeSchema,
  
  // Export
  exportConfigSchema,
  
  // Settings
  notificationSettingsSchema,
  academicCalendarSchema,
  
  // Custom validations
  customValidations,
  messages
}