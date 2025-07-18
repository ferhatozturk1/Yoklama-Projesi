/**
 * Academic-specific validation rules and utilities
 */

/**
 * Validate academic calendar restrictions
 * @param {Date} date - Date to validate
 * @param {Object} calendar - Academic calendar with restrictions
 * @returns {Object} - Validation result
 */
export const validateAcademicDate = (date, calendar) => {
  if (!date || !calendar) {
    return { isValid: false, reason: 'Tarih veya takvim bilgisi eksik' }
  }
  
  const checkDate = new Date(date)
  const semesterStart = new Date(calendar.semesterStart)
  const semesterEnd = new Date(calendar.semesterEnd)
  
  // Check if date is within semester
  if (checkDate < semesterStart || checkDate > semesterEnd) {
    return { 
      isValid: false, 
      reason: 'Tarih akademik dönem dışında',
      type: 'out_of_semester'
    }
  }
  
  // Check if date is a holiday
  if (calendar.holidays && Array.isArray(calendar.holidays)) {
    for (const holiday of calendar.holidays) {
      const holidayStart = new Date(holiday.startDate)
      const holidayEnd = new Date(holiday.endDate)
      
      if (checkDate >= holidayStart && checkDate <= holidayEnd) {
        return { 
          isValid: false, 
          reason: `${holiday.name} tatili`,
          type: 'holiday',
          holidayName: holiday.name
        }
      }
    }
  }
  
  // Check if date is weekend (Saturday or Sunday)
  const dayOfWeek = checkDate.getDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { 
      isValid: false, 
      reason: 'Hafta sonu',
      type: 'weekend'
    }
  }
  
  // Check if date is in the future (for attendance)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  
  if (checkDate > today) {
    return { 
      isValid: false, 
      reason: 'Gelecek tarih için devamsızlık alınamaz',
      type: 'future_date'
    }
  }
  
  return { isValid: true, reason: null, type: null }
}

/**
 * Validate class session timing
 * @param {string} startTime - Start time (HH:MM)
 * @param {string} endTime - End time (HH:MM)
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateSessionTiming = (startTime, endTime, options = {}) => {
  const {
    minDuration = 50, // Minimum 50 minutes
    maxDuration = 180, // Maximum 3 hours
    allowedStartTimes = [], // Specific allowed start times
    workingHours = { start: '08:00', end: '18:00' }
  } = options
  
  if (!startTime || !endTime) {
    return { isValid: false, reason: 'Başlangıç ve bitiş saati gereklidir' }
  }
  
  const start = new Date(`2000-01-01 ${startTime}`)
  const end = new Date(`2000-01-01 ${endTime}`)
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, reason: 'Geçersiz saat formatı' }
  }
  
  if (end <= start) {
    return { isValid: false, reason: 'Bitiş saati başlangıç saatinden sonra olmalıdır' }
  }
  
  // Check duration
  const durationMinutes = (end - start) / (1000 * 60)
  if (durationMinutes < minDuration) {
    return { isValid: false, reason: `Ders süresi en az ${minDuration} dakika olmalıdır` }
  }
  
  if (durationMinutes > maxDuration) {
    return { isValid: false, reason: `Ders süresi en fazla ${maxDuration} dakika olmalıdır` }
  }
  
  // Check working hours
  if (workingHours.start && workingHours.end) {
    const workStart = new Date(`2000-01-01 ${workingHours.start}`)
    const workEnd = new Date(`2000-01-01 ${workingHours.end}`)
    
    if (start < workStart || end > workEnd) {
      return { 
        isValid: false, 
        reason: `Ders saatleri ${workingHours.start}-${workingHours.end} arasında olmalıdır` 
      }
    }
  }
  
  // Check allowed start times
  if (allowedStartTimes.length > 0 && !allowedStartTimes.includes(startTime)) {
    return { 
      isValid: false, 
      reason: `İzin verilen başlangıç saatleri: ${allowedStartTimes.join(', ')}` 
    }
  }
  
  return { isValid: true, reason: null }
}

/**
 * Validate course prerequisites
 * @param {Object} course - Course to validate
 * @param {Array} completedCourses - List of completed courses
 * @returns {Object} - Validation result
 */
export const validateCoursePrerequisites = (course, completedCourses = []) => {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return { isValid: true, missingPrerequisites: [] }
  }
  
  const completedCodes = completedCourses.map(c => c.code)
  const missingPrerequisites = course.prerequisites.filter(
    prereq => !completedCodes.includes(prereq)
  )
  
  return {
    isValid: missingPrerequisites.length === 0,
    missingPrerequisites
  }
}

/**
 * Validate student enrollment capacity
 * @param {Object} course - Course information
 * @param {number} currentEnrollment - Current number of enrolled students
 * @returns {Object} - Validation result
 */
export const validateEnrollmentCapacity = (course, currentEnrollment) => {
  if (!course.maxCapacity) {
    return { isValid: true, reason: null }
  }
  
  if (currentEnrollment >= course.maxCapacity) {
    return { 
      isValid: false, 
      reason: `Ders kapasitesi dolu (${course.maxCapacity}/${course.maxCapacity})` 
    }
  }
  
  const remainingSpots = course.maxCapacity - currentEnrollment
  let warning = null
  
  if (remainingSpots <= 5) {
    warning = `Sadece ${remainingSpots} yer kaldı`
  }
  
  return { 
    isValid: true, 
    reason: null, 
    warning,
    remainingSpots 
  }
}

/**
 * Validate attendance percentage requirements
 * @param {Array} attendanceRecords - Student's attendance records
 * @param {Object} requirements - Attendance requirements
 * @returns {Object} - Validation result
 */
export const validateAttendanceRequirement = (attendanceRecords, requirements = {}) => {
  const { minimumPercentage = 70, warningPercentage = 80 } = requirements
  
  if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    return { 
      isValid: true, 
      percentage: 100, 
      status: 'no_records' 
    }
  }
  
  const totalSessions = attendanceRecords.length
  const presentSessions = attendanceRecords.filter(record => record.status === 'present').length
  const percentage = (presentSessions / totalSessions) * 100
  
  let status = 'good'
  let message = `Devam oranı: %${percentage.toFixed(1)}`
  
  if (percentage < minimumPercentage) {
    status = 'critical'
    message = `Devam oranı kritik seviyede: %${percentage.toFixed(1)} (Minimum: %${minimumPercentage})`
  } else if (percentage < warningPercentage) {
    status = 'warning'
    message = `Devam oranı uyarı seviyesinde: %${percentage.toFixed(1)} (Hedef: %${warningPercentage})`
  }
  
  return {
    isValid: percentage >= minimumPercentage,
    percentage: parseFloat(percentage.toFixed(1)),
    status,
    message,
    presentSessions,
    totalSessions
  }
}

/**
 * Validate makeup class eligibility
 * @param {Object} originalSession - Original session that was missed
 * @param {Date} makeupDate - Proposed makeup date
 * @param {Object} calendar - Academic calendar
 * @returns {Object} - Validation result
 */
export const validateMakeupClassEligibility = (originalSession, makeupDate, calendar) => {
  if (!originalSession || !makeupDate) {
    return { isValid: false, reason: 'Eksik bilgi' }
  }
  
  const originalDate = new Date(originalSession.date)
  const makeup = new Date(makeupDate)
  
  // Makeup class should be within the same semester
  const semesterStart = new Date(calendar.semesterStart)
  const semesterEnd = new Date(calendar.semesterEnd)
  
  if (makeup < semesterStart || makeup > semesterEnd) {
    return { 
      isValid: false, 
      reason: 'Telafi dersi aynı dönem içinde olmalıdır' 
    }
  }
  
  // Makeup class should be after the original date
  if (makeup <= originalDate) {
    return { 
      isValid: false, 
      reason: 'Telafi dersi orijinal dersten sonra olmalıdır' 
    }
  }
  
  // Check if makeup date is valid according to academic calendar
  const dateValidation = validateAcademicDate(makeup, calendar)
  if (!dateValidation.isValid) {
    return { 
      isValid: false, 
      reason: `Telafi tarihi uygun değil: ${dateValidation.reason}` 
    }
  }
  
  // Makeup class should be within reasonable time (e.g., within 4 weeks)
  const timeDiff = makeup - originalDate
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24)
  
  if (daysDiff > 28) { // 4 weeks
    return { 
      isValid: false, 
      reason: 'Telafi dersi 4 hafta içinde yapılmalıdır' 
    }
  }
  
  return { isValid: true, reason: null }
}

/**
 * Validate grade input
 * @param {number|string} grade - Grade to validate
 * @param {Object} gradingSystem - Grading system configuration
 * @returns {Object} - Validation result
 */
export const validateGrade = (grade, gradingSystem = {}) => {
  const { 
    type = 'numeric', // 'numeric' or 'letter'
    minGrade = 0,
    maxGrade = 100,
    letterGrades = ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FD', 'FF']
  } = gradingSystem
  
  if (grade === null || grade === undefined || grade === '') {
    return { isValid: false, reason: 'Not girilmelidir' }
  }
  
  if (type === 'numeric') {
    const numericGrade = parseFloat(grade)
    
    if (isNaN(numericGrade)) {
      return { isValid: false, reason: 'Geçerli bir sayı giriniz' }
    }
    
    if (numericGrade < minGrade || numericGrade > maxGrade) {
      return { 
        isValid: false, 
        reason: `Not ${minGrade}-${maxGrade} arasında olmalıdır` 
      }
    }
    
    return { isValid: true, normalizedGrade: numericGrade }
  }
  
  if (type === 'letter') {
    const letterGrade = grade.toString().toUpperCase()
    
    if (!letterGrades.includes(letterGrade)) {
      return { 
        isValid: false, 
        reason: `Geçerli harf notları: ${letterGrades.join(', ')}` 
      }
    }
    
    return { isValid: true, normalizedGrade: letterGrade }
  }
  
  return { isValid: false, reason: 'Bilinmeyen not sistemi' }
}

/**
 * Validate semester course load
 * @param {Array} courses - List of courses for the semester
 * @param {Object} limits - Course load limits
 * @returns {Object} - Validation result
 */
export const validateSemesterCourseLoad = (courses, limits = {}) => {
  const {
    minCredits = 12,
    maxCredits = 30,
    maxCourses = 8
  } = limits
  
  if (!Array.isArray(courses)) {
    return { isValid: false, reason: 'Ders listesi geçersiz' }
  }
  
  const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0)
  const courseCount = courses.length
  
  const warnings = []
  const errors = []
  
  if (totalCredits < minCredits) {
    errors.push(`Minimum ${minCredits} kredi alınmalıdır (Mevcut: ${totalCredits})`)
  }
  
  if (totalCredits > maxCredits) {
    errors.push(`Maksimum ${maxCredits} kredi alınabilir (Mevcut: ${totalCredits})`)
  }
  
  if (courseCount > maxCourses) {
    errors.push(`Maksimum ${maxCourses} ders alınabilir (Mevcut: ${courseCount})`)
  }
  
  if (totalCredits > maxCredits * 0.9) {
    warnings.push('Yüksek kredi yükü - dikkatli olun')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalCredits,
    courseCount
  }
}

/**
 * Academic validation constants
 */
export const ACADEMIC_CONSTANTS = {
  SEMESTER_TYPES: ['Fall', 'Spring', 'Summer'],
  COURSE_TYPES: ['Mandatory', 'Elective', 'Optional'],
  ATTENDANCE_STATUSES: ['present', 'absent', 'excused'],
  SESSION_TYPES: ['regular', 'makeup', 'exam'],
  GRADE_TYPES: ['numeric', 'letter'],
  
  // Time slots for scheduling
  TIME_SLOTS: [
    '08:30-09:20',
    '09:30-10:20', 
    '10:30-11:20',
    '11:30-12:20',
    '13:30-14:20',
    '14:30-15:20',
    '15:30-16:20',
    '16:30-17:20'
  ],
  
  // Days of week
  WEEKDAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  
  // Default limits
  DEFAULT_LIMITS: {
    MIN_CREDITS: 12,
    MAX_CREDITS: 30,
    MAX_COURSES: 8,
    MIN_ATTENDANCE: 70,
    WARNING_ATTENDANCE: 80,
    MAX_MAKEUP_DAYS: 28
  }
}

export default {
  validateAcademicDate,
  validateSessionTiming,
  validateCoursePrerequisites,
  validateEnrollmentCapacity,
  validateAttendanceRequirement,
  validateMakeupClassEligibility,
  validateGrade,
  validateSemesterCourseLoad,
  ACADEMIC_CONSTANTS
}