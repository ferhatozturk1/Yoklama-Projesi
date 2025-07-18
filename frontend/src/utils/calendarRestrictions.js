import { isHoliday, isExamWeek, isAcademicPeriod, isClassTime } from './dateHelpers'

/**
 * Check if a class can be started at the given date and time
 * @param {Date} date - The date to check
 * @param {Object} classSchedule - The class schedule object with day, startTime, endTime
 * @param {Array} holidays - List of holidays
 * @param {Array} examPeriods - List of exam periods
 * @param {Object} semesterDates - Semester start and end dates
 * @returns {Object} - Result with allowed status and reason
 */
export const canStartClass = (date, classSchedule, holidays, examPeriods, semesterDates) => {
  // Check if it's a holiday
  if (isHoliday(date, holidays)) {
    const holiday = holidays.find(h => 
      new Date(h.date).toDateString() === date.toDateString()
    )
    
    return {
      allowed: false,
      reason: `Bugün ${holiday?.name || 'resmi tatil'}, yoklama başlatılamaz.`
    }
  }

  // Check if it's exam week
  if (isExamWeek(date, examPeriods)) {
    const examPeriod = examPeriods.find(e => 
      date >= new Date(e.startDate) && date <= new Date(e.endDate)
    )
    
    return {
      allowed: false,
      reason: `${examPeriod?.name || 'Sınav haftası'}, normal ders yoklaması başlatılamaz.`
    }
  }

  // Check if it's within academic period
  if (!isAcademicPeriod(date, semesterDates)) {
    return {
      allowed: false,
      reason: 'Akademik takvim dışı dönem, yoklama başlatılamaz.'
    }
  }

  // Check if it's class time (if schedule is provided)
  if (classSchedule) {
    if (!isClassTime(classSchedule, date)) {
      return {
        allowed: false,
        reason: 'Şu anda ders saati değil, yoklama başlatılamaz.'
      }
    }
  }

  return {
    allowed: true,
    reason: null
  }
}

/**
 * Check if a date is valid for scheduling a class
 * @param {Date} date - The date to check
 * @param {String} day - The day of the week for the class
 * @param {Array} holidays - List of holidays
 * @param {Array} examPeriods - List of exam periods
 * @param {Object} semesterDates - Semester start and end dates
 * @returns {Object} - Result with valid status and reason
 */
export const isValidClassDate = (date, day, holidays, examPeriods, semesterDates) => {
  // Check if it's a holiday
  if (isHoliday(date, holidays)) {
    const holiday = holidays.find(h => 
      new Date(h.date).toDateString() === date.toDateString()
    )
    
    return {
      valid: false,
      reason: `${holiday?.name || 'Resmi tatil'} günü ders programlanamaz.`
    }
  }

  // Check if it's exam week
  if (isExamWeek(date, examPeriods)) {
    return {
      valid: false,
      reason: 'Sınav haftasında normal ders programlanamaz.'
    }
  }

  // Check if it's within academic period
  if (!isAcademicPeriod(date, semesterDates)) {
    return {
      valid: false,
      reason: 'Akademik takvim dışı dönemde ders programlanamaz.'
    }
  }

  // Check if the day of the week matches
  const dayMap = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5
  }
  
  if (day && date.getDay() !== dayMap[day]) {
    return {
      valid: false,
      reason: `Seçilen tarih ${day} gününe denk gelmiyor.`
    }
  }

  return {
    valid: true,
    reason: null
  }
}

/**
 * Check if a time slot is available for scheduling
 * @param {Object} schedule - The current schedule
 * @param {String} day - The day of the week
 * @param {String} startTime - The start time (HH:MM)
 * @param {String} endTime - The end time (HH:MM)
 * @param {String} excludeCourseId - Course ID to exclude from conflict check
 * @returns {Object} - Result with available status and reason
 */
export const isTimeSlotAvailable = (schedule, day, startTime, endTime, excludeCourseId = null) => {
  // If no schedule for this day, the slot is available
  if (!schedule[day]) {
    return {
      available: true,
      reason: null
    }
  }
  
  // Check for conflicts with existing courses
  for (const timeSlot in schedule[day]) {
    const course = schedule[day][timeSlot]
    
    // Skip the course being edited
    if (excludeCourseId && course.id === excludeCourseId) {
      continue
    }
    
    const courseStart = course.schedule.startTime
    const courseEnd = course.schedule.endTime
    
    // Check for overlap
    if ((startTime >= courseStart && startTime < courseEnd) || 
        (endTime > courseStart && endTime <= courseEnd) ||
        (startTime <= courseStart && endTime >= courseEnd)) {
      return {
        available: false,
        reason: `Bu zaman diliminde başka bir ders var: ${course.code} (${courseStart} - ${courseEnd}).`
      }
    }
  }
  
  return {
    available: true,
    reason: null
  }
}

/**
 * Generate warning messages for a scheduled class
 * @param {Date} date - The class date
 * @param {Array} holidays - List of holidays
 * @param {Array} examPeriods - List of exam periods
 * @returns {Array} - List of warning messages
 */
export const getClassWarnings = (date, holidays, examPeriods) => {
  const warnings = []
  
  // Check if it's close to a holiday
  const holidayDate = holidays.find(h => {
    const holidayDate = new Date(h.date)
    const diffDays = Math.abs(Math.floor((date - holidayDate) / (1000 * 60 * 60 * 24)))
    return diffDays <= 1 // 1 day before or after
  })
  
  if (holidayDate) {
    warnings.push(`Dikkat: Seçilen tarih ${holidayDate.name} tarihine yakın.`)
  }
  
  // Check if it's close to an exam period
  const examPeriod = examPeriods.find(e => {
    const examStart = new Date(e.startDate)
    const examEnd = new Date(e.endDate)
    const diffDaysStart = Math.floor((examStart - date) / (1000 * 60 * 60 * 24))
    const diffDaysEnd = Math.floor((date - examEnd) / (1000 * 60 * 60 * 24))
    
    return (diffDaysStart > 0 && diffDaysStart <= 3) || (diffDaysEnd > 0 && diffDaysEnd <= 3)
  })
  
  if (examPeriod) {
    warnings.push(`Dikkat: Seçilen tarih ${examPeriod.name} dönemine yakın.`)
  }
  
  return warnings
}