/**
 * Academic-specific validation utilities
 */
import { format, isValid, parseISO, differenceInDays, differenceInWeeks, isWithinInterval } from 'date-fns'
import { tr } from 'date-fns/locale'

/**
 * Check if a date is within the academic semester
 * @param {Date|string} date - Date to check
 * @param {Object} calendar - Academic calendar object
 * @returns {boolean} - Whether the date is within the semester
 */
export const isWithinSemester = (date, calendar) => {
  if (!calendar || !calendar.semesterStart || !calendar.semesterEnd) {
    return false
  }
  
  const checkDate = date instanceof Date ? date : parseISO(date)
  const semesterStart = parseISO(calendar.semesterStart)
  const semesterEnd = parseISO(calendar.semesterEnd)
  
  if (!isValid(checkDate) || !isValid(semesterStart) || !isValid(semesterEnd)) {
    return false
  }
  
  return isWithinInterval(checkDate, { start: semesterStart, end: semesterEnd })
}

/**
 * Check if a date is a holiday
 * @param {Date|string} date - Date to check
 * @param {Object} calendar - Academic calendar object
 * @returns {Object|null} - Holiday object if date is a holiday, null otherwise
 */
export const getHolidayForDate = (date, calendar) => {
  if (!calendar || !calendar.holidays || !Array.isArray(calendar.holidays)) {
    return null
  }
  
  const checkDate = date instanceof Date ? date : parseISO(date)
  
  if (!isValid(checkDate)) {
    return null
  }
  
  return calendar.holidays.find(holiday => {
    const holidayStart = parseISO(holiday.startDate)
    const holidayEnd = parseISO(holiday.endDate)
    
    if (!isValid(holidayStart) || !isValid(holidayEnd)) {
      return false
    }
    
    return isWithinInterval(checkDate, { start: holidayStart, end: holidayEnd })
  }) || null
}

/**
 * Check if a date is an exam period
 * @param {Date|string} date - Date to check
 * @param {Object} calendar - Academic calendar object
 * @returns {boolean} - Whether the date is in an exam period
 */
export const isExamPeriod = (date, calendar) => {
  if (!calendar || !calendar.examPeriods || !Array.isArray(calendar.examPeriods)) {
    return false
  }
  
  const checkDate = date instanceof Date ? date : parseISO(date)
  
  if (!isValid(checkDate)) {
    return false
  }
  
  return calendar.examPeriods.some(period => {
    const periodStart = parseISO(period.startDate)
    const periodEnd = parseISO(period.endDate)
    
    if (!isValid(periodStart) || !isValid(periodEnd)) {
      return false
    }
    
    return isWithinInterval(checkDate, { start: periodStart, end: periodEnd })
  })
}

/**
 * Get week number within the semester
 * @param {Date|string} date - Date to check
 * @param {Object} calendar - Academic calendar object
 * @returns {number} - Week number (1-based) or -1 if invalid
 */
export const getSemesterWeek = (date, calendar) => {
  if (!calendar || !calendar.semesterStart) {
    return -1
  }
  
  const checkDate = date instanceof Date ? date : parseISO(date)
  const semesterStart = parseISO(calendar.semesterStart)
  
  if (!isValid(checkDate) || !isValid(semesterStart)) {
    return -1
  }
  
  // If date is before semester start, return -1
  if (checkDate < semesterStart) {
    return -1
  }
  
  // Calculate week number (1-based)
  return Math.floor(differenceInDays(checkDate, semesterStart) / 7) + 1
}

/**
 * Format academic date with Turkish locale
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string
 * @returns {string} - Formatted date
 */
export const formatAcademicDate = (date, formatStr = 'PPP') => {
  const parsedDate = date instanceof Date ? date : parseISO(date)
  
  if (!isValid(parsedDate)) {
    return 'Geçersiz Tarih'
  }
  
  return format(parsedDate, formatStr, { locale: tr })
}

/**
 * Check if a class can be started on a specific date and time
 * @param {Date|string} date - Date to check
 * @param {string} startTime - Start time (HH:MM)
 * @param {string} endTime - End time (HH:MM)
 * @param {Object} calendar - Academic calendar object
 * @param {Object} schedule - Course schedule object
 * @returns {Object} - Validation result
 */
export const validateClassStart = (date, startTime, endTime, calendar, schedule) => {
  const errors = []
  
  // Check if date is valid
  const checkDate = date instanceof Date ? date : parseISO(date)
  if (!isValid(checkDate)) {
    errors.push('Geçersiz tarih')
    return { isValid: false, errors }
  }
  
  // Check if date is within semester
  if (!isWithinSemester(checkDate, calendar)) {
    errors.push('Seçilen tarih akademik dönem içinde değil')
  }
  
  // Check if date is a holiday
  const holiday = getHolidayForDate(checkDate, calendar)
  if (holiday) {
    errors.push(`Seçilen tarih tatil günü: ${holiday.name}`)
  }
  
  // Check if date is in exam period
  if (isExamPeriod(checkDate, calendar)) {
    errors.push('Seçilen tarih sınav döneminde')
  }
  
  // Check if time is valid for the schedule
  if (schedule) {
    const dayOfWeek = format(checkDate, 'EEEE', { locale: tr })
    const scheduleDay = Object.keys(schedule).find(day => 
      day.toLowerCase() === dayOfWeek.toLowerCase()
    )
    
    if (!scheduleDay) {
      errors.push(`Bu gün (${dayOfWeek}) için planlanmış ders yok`)
    } else {
      const scheduledTime = schedule[scheduleDay]
      if (scheduledTime.startTime !== startTime || scheduledTime.endTime !== endTime) {
        errors.push(`Seçilen saat programdaki saat ile uyuşmuyor (${scheduledTime.startTime}-${scheduledTime.endTime})`)
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Calculate attendance statistics for a course
 * @param {Array} attendanceRecords - Attendance records
 * @param {Array} students - Student list
 * @returns {Object} - Attendance statistics
 */
export const calculateAttendanceStats = (attendanceRecords, students) => {
  if (!Array.isArray(attendanceRecords) || !Array.isArray(students) || students.length === 0) {
    return {
      totalSessions: 0,
      averageAttendance: 0,
      attendanceByStudent: {},
      attendanceBySession: {}
    }
  }
  
  const totalStudents = students.length
  const totalSessions = attendanceRecords.length
  
  // Initialize attendance by student
  const attendanceByStudent = students.reduce((acc, student) => {
    acc[student.id] = {
      present: 0,
      absent: 0,
      excused: 0,
      total: totalSessions,
      rate: 0
    }
    return acc
  }, {})
  
  // Initialize attendance by session
  const attendanceBySession = attendanceRecords.reduce((acc, record) => {
    acc[record.id] = {
      date: record.sessionDate,
      present: 0,
      absent: 0,
      excused: 0,
      total: totalStudents,
      rate: 0
    }
    return acc
  }, {})
  
  // Calculate attendance statistics
  attendanceRecords.forEach(record => {
    record.attendanceData.forEach(data => {
      if (data.status === 'present') {
        attendanceByStudent[data.studentId].present++
        attendanceBySession[record.id].present++
      } else if (data.status === 'absent') {
        attendanceByStudent[data.studentId].absent++
        attendanceBySession[record.id].absent++
      } else if (data.status === 'excused') {
        attendanceByStudent[data.studentId].excused++
        attendanceBySession[record.id].excused++
      }
    })
  })
  
  // Calculate attendance rates
  Object.keys(attendanceByStudent).forEach(studentId => {
    const student = attendanceByStudent[studentId]
    student.rate = totalSessions > 0 ? (student.present + student.excused) / totalSessions : 0
  })
  
  Object.keys(attendanceBySession).forEach(sessionId => {
    const session = attendanceBySession[sessionId]
    session.rate = totalStudents > 0 ? session.present / totalStudents : 0
  })
  
  // Calculate average attendance rate
  const totalPresent = Object.values(attendanceBySession).reduce((sum, session) => sum + session.present, 0)
  const totalPossible = totalStudents * totalSessions
  const averageAttendance = totalPossible > 0 ? totalPresent / totalPossible : 0
  
  return {
    totalSessions,
    averageAttendance,
    attendanceByStudent,
    attendanceBySession
  }
}

/**
 * Check if a student has met attendance requirements
 * @param {Object} student - Student with attendance data
 * @param {number} requiredRate - Required attendance rate (0-1)
 * @returns {boolean} - Whether student has met requirements
 */
export const hasMetAttendanceRequirement = (student, requiredRate = 0.7) => {
  if (!student || !student.attendance) {
    return false
  }
  
  const { present, excused, total } = student.attendance
  if (total === 0) {
    return true
  }
  
  const attendanceRate = (present + excused) / total
  return attendanceRate >= requiredRate
}

/**
 * Generate weekly schedule from course data
 * @param {Array} courses - Course data
 * @returns {Object} - Weekly schedule
 */
export const generateWeeklySchedule = (courses) => {
  if (!Array.isArray(courses)) {
    return {}
  }
  
  const weeklySchedule = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
  }
  
  courses.forEach(course => {
    if (course.schedule) {
      const { day, startTime, endTime } = course.schedule
      if (weeklySchedule[day]) {
        weeklySchedule[day].push({
          id: course.id,
          name: course.name,
          code: course.code,
          startTime,
          endTime,
          classroom: course.classroom || '',
          color: course.color || '#3b82f6'
        })
      }
    }
  })
  
  // Sort each day's schedule by start time
  Object.keys(weeklySchedule).forEach(day => {
    weeklySchedule[day].sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number)
      const timeB = b.startTime.split(':').map(Number)
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
    })
  })
  
  return weeklySchedule
}

/**
 * Extend weekly schedule to full semester
 * @param {Object} weeklySchedule - Weekly schedule
 * @param {Date|string} semesterStart - Semester start date
 * @param {number} weeks - Number of weeks
 * @param {Array} holidays - Holiday periods
 * @returns {Array} - Full semester schedule
 */
export const extendToSemesterSchedule = (weeklySchedule, semesterStart, weeks = 15, holidays = []) => {
  if (!weeklySchedule || !semesterStart) {
    return []
  }
  
  const startDate = semesterStart instanceof Date ? semesterStart : parseISO(semesterStart)
  if (!isValid(startDate)) {
    return []
  }
  
  const semesterSchedule = []
  
  // For each week
  for (let week = 0; week < weeks; week++) {
    // For each day of the week
    Object.keys(weeklySchedule).forEach(day => {
      const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].indexOf(day)
      if (dayIndex === -1) return
      
      // Calculate the date for this day in this week
      const date = new Date(startDate)
      date.setDate(date.getDate() + week * 7 + dayIndex)
      
      // Check if this date is a holiday
      const isHoliday = holidays.some(holiday => {
        const holidayStart = parseISO(holiday.startDate)
        const holidayEnd = parseISO(holiday.endDate)
        return isWithinInterval(date, { start: holidayStart, end: holidayEnd })
      })
      
      if (!isHoliday) {
        // Add each course for this day
        weeklySchedule[day].forEach(course => {
          semesterSchedule.push({
            ...course,
            date,
            week: week + 1,
            day
          })
        })
      }
    })
  }
  
  return semesterSchedule
}

export default {
  isWithinSemester,
  getHolidayForDate,
  isExamPeriod,
  getSemesterWeek,
  formatAcademicDate,
  validateClassStart,
  calculateAttendanceStats,
  hasMetAttendanceRequirement,
  generateWeeklySchedule,
  extendToSemesterSchedule
}