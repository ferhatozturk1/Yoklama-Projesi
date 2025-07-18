import * as Yup from 'yup'

// Email validation
export const emailSchema = Yup.string()
  .email('Geçerli bir e-posta adresi giriniz')
  .required('E-posta adresi zorunludur')

// Password validation
export const passwordSchema = Yup.string()
  .min(8, 'Şifre en az 8 karakter olmalıdır')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'
  )
  .required('Şifre zorunludur')

// Name validation
export const nameSchema = Yup.string()
  .min(2, 'Ad en az 2 karakter olmalıdır')
  .max(50, 'Ad en fazla 50 karakter olabilir')
  .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Ad sadece harf içerebilir')
  .required('Ad zorunludur')

// Title validation
export const titleSchema = Yup.string()
  .oneOf(['Dr.', 'Doç. Dr.', 'Prof. Dr.', 'Öğr. Gör.', 'Arş. Gör.'], 'Geçerli bir ünvan seçiniz')
  .required('Ünvan zorunludur')

// University/Faculty/Department validation
export const institutionSchema = Yup.string()
  .min(2, 'En az 2 karakter olmalıdır')
  .max(100, 'En fazla 100 karakter olabilir')
  .required('Bu alan zorunludur')

// Course code validation
export const courseCodeSchema = Yup.string()
  .matches(/^[A-Z]{2,4}\d{3}$/, 'Ders kodu formatı: ABC123')
  .required('Ders kodu zorunludur')

// Student number validation
export const studentNumberSchema = Yup.string()
  .matches(/^\d{9,11}$/, 'Öğrenci numarası 9-11 haneli olmalıdır')
  .required('Öğrenci numarası zorunludur')

// Phone number validation
export const phoneSchema = Yup.string()
  .matches(/^(\+90|0)?[5][0-9]{9}$/, 'Geçerli bir telefon numarası giriniz')

// File validation
export const createFileSchema = (allowedTypes, maxSize = 5 * 1024 * 1024) => {
  return Yup.mixed()
    .test('fileType', 'Desteklenmeyen dosya formatı', (value) => {
      if (!value) return true
      return allowedTypes.includes(value.type)
    })
    .test('fileSize', `Dosya boyutu ${maxSize / (1024 * 1024)}MB'dan küçük olmalıdır`, (value) => {
      if (!value) return true
      return value.size <= maxSize
    })
}

// Login form validation schema
export const loginValidationSchema = Yup.object({
  email: emailSchema,
  password: Yup.string().required('Şifre zorunludur')
})

// Registration form validation schema
export const registrationValidationSchema = Yup.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunludur'),
  title: titleSchema,
  university: institutionSchema,
  faculty: institutionSchema,
  department: institutionSchema,
  profilePhoto: createFileSchema(['image/jpeg', 'image/png'], 2 * 1024 * 1024).nullable(),
  academicCalendar: createFileSchema(['application/pdf'], 10 * 1024 * 1024).nullable()
})

// Profile update validation schema
export const profileUpdateValidationSchema = Yup.object({
  firstName: nameSchema,
  lastName: nameSchema,
  title: titleSchema,
  university: institutionSchema,
  faculty: institutionSchema,
  department: institutionSchema,
  profilePhoto: createFileSchema(['image/jpeg', 'image/png'], 2 * 1024 * 1024),
  academicCalendar: createFileSchema(['application/pdf'], 10 * 1024 * 1024)
})

// Course creation validation schema
export const courseValidationSchema = Yup.object({
  code: courseCodeSchema,
  name: Yup.string()
    .min(2, 'Ders adı en az 2 karakter olmalıdır')
    .max(100, 'Ders adı en fazla 100 karakter olabilir')
    .required('Ders adı zorunludur'),
  section: Yup.string()
    .matches(/^\d{1,2}$/, 'Şube numarası 1-2 haneli olmalıdır')
    .required('Şube numarası zorunludur'),
  classroom: Yup.string()
    .min(1, 'Derslik bilgisi zorunludur')
    .max(50, 'Derslik adı en fazla 50 karakter olabilir')
    .required('Derslik zorunludur'),
  schedule: Yup.object({
    day: Yup.string()
      .oneOf(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], 'Geçerli bir gün seçiniz')
      .required('Gün seçimi zorunludur'),
    startTime: Yup.string()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı giriniz (HH:MM)')
      .required('Başlangıç saati zorunludur'),
    endTime: Yup.string()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı giriniz (HH:MM)')
      .required('Bitiş saati zorunludur')
  }).test('timeRange', 'Bitiş saati başlangıç saatinden sonra olmalıdır', function(value) {
    if (!value?.startTime || !value?.endTime) return true
    return value.startTime < value.endTime
  })
})

// Student upload validation schema
export const studentUploadValidationSchema = Yup.object({
  file: createFileSchema([
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/pdf',
    'text/csv'
  ], 10 * 1024 * 1024).required('Dosya seçimi zorunludur')
})

// Password change validation schema
export const passwordChangeValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Mevcut şifre zorunludur'),
  newPassword: passwordSchema,
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Şifreler eşleşmiyor')
    .required('Yeni şifre tekrarı zorunludur')
})

// Custom validation functions
export const validateTurkishId = (id) => {
  if (!id || id.length !== 11) return false
  
  const digits = id.split('').map(Number)
  const checksum = digits[10]
  
  // Calculate checksum
  let sum1 = 0, sum2 = 0
  for (let i = 0; i < 9; i++) {
    if (i % 2 === 0) sum1 += digits[i]
    else sum2 += digits[i]
  }
  
  const calculatedChecksum = ((sum1 * 7) - sum2) % 10
  return calculatedChecksum === checksum
}

export const validateClassroomCode = (code) => {
  // Classroom codes should be alphanumeric and 2-10 characters
  const regex = /^[A-Z0-9]{2,10}$/
  return regex.test(code)
}

export const validateTimeSlot = (startTime, endTime) => {
  if (!startTime || !endTime) return false
  
  const start = new Date(`2000-01-01T${startTime}:00`)
  const end = new Date(`2000-01-01T${endTime}:00`)
  
  return start < end
}

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return start <= end && !isNaN(start.getTime()) && !isNaN(end.getTime())
}