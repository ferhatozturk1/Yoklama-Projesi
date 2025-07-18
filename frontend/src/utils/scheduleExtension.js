/**
 * Extends a weekly schedule to a full semester (15 weeks)
 * @param {Object} weeklySchedule - The weekly schedule object
 * @param {Date} semesterStartDate - The semester start date
 * @param {Date} semesterEndDate - The semester end date
 * @param {Array} holidays - List of holidays to exclude
 * @param {Array} examPeriods - List of exam periods to exclude
 * @returns {Array} - Array of scheduled classes for the semester
 */
export const extendScheduleToSemester = (weeklySchedule, semesterStartDate, semesterEndDate, holidays = [], examPeriods = []) => {
  const semesterClasses = []
  
  // Map day strings to day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayMap = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5
  }
  
  // For each day in the weekly schedule
  for (const day in weeklySchedule) {
    const dayNumber = dayMap[day]
    if (!dayNumber) continue
    
    // For each time slot in the day
    for (const timeSlot in weeklySchedule[day]) {
      const course = weeklySchedule[day][timeSlot]
      
      // Find the first occurrence of this day in the semester
      let currentDate = new Date(semesterStartDate)
      while (currentDate.getDay() !== dayNumber) {
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      // Generate classes for each week of the semester
      while (currentDate <= semesterEndDate) {
        // Check if this date is a holiday
        const isHolidayDate = holidays.some(holiday => 
          new Date(holiday.date).toDateString() === currentDate.toDateString()
        )
        
        // Check if this date is in an exam period
        const isExamDate = examPeriods.some(exam => {
          const examStart = new Date(exam.startDate)
          const examEnd = new Date(exam.endDate)
          return currentDate >= examStart && currentDate <= examEnd
        })
        
        // If not a holiday or exam day, add to semester classes
        if (!isHolidayDate && !isExamDate) {
          semesterClasses.push({
            id: `${course.id}-${currentDate.toISOString()}`,
            courseId: course.id,
            code: course.code,
            name: course.name,
            section: course.section,
            classroom: course.classroom,
            date: new Date(currentDate),
            startTime: course.schedule.startTime,
            endTime: course.schedule.endTime,
            status: 'scheduled' // scheduled, completed, canceled
          })
        }
        
        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7)
      }
    }
  }
  
  // Sort by date and time
  return semesterClasses.sort((a, b) => {
    if (a.date.getTime() !== b.date.getTime()) {
      return a.date - b.date
    }
    return a.startTime.localeCompare(b.startTime)
  })
}

/**
 * Generates a schedule summary
 * @param {Object} weeklySchedule - The weekly schedule object
 * @returns {Object} - Summary statistics
 */
export const generateScheduleSummary = (weeklySchedule) => {
  const summary = {
    totalCourses: 0,
    totalHours: 0,
    coursesByDay: {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0
    }
  }
  
  // For each day in the weekly schedule
  for (const day in weeklySchedule) {
    // For each time slot in the day
    for (const timeSlot in weeklySchedule[day]) {
      const course = weeklySchedule[day][timeSlot]
      
      // Increment course count
      summary.totalCourses++
      summary.coursesByDay[day]++
      
      // Calculate hours
      const startTime = course.schedule.startTime.split(':').map(Number)
      const endTime = course.schedule.endTime.split(':').map(Number)
      
      const startMinutes = startTime[0] * 60 + startTime[1]
      const endMinutes = endTime[0] * 60 + endTime[1]
      
      const durationHours = (endMinutes - startMinutes) / 60
      summary.totalHours += durationHours
    }
  }
  
  return summary
}

/**
 * Exports a schedule to iCalendar format
 * @param {Array} semesterClasses - Array of scheduled classes
 * @param {String} calendarName - Name of the calendar
 * @returns {String} - iCalendar format string
 */
export const exportScheduleToICalendar = (semesterClasses, calendarName = 'Ders Programı') => {
  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Teacher Attendance System//EN',
    `X-WR-CALNAME:${calendarName}`,
    'CALSCALE:GREGORIAN'
  ]
  
  // For each class in the semester
  semesterClasses.forEach(classItem => {
    const dateString = classItem.date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const startDateTime = dateString.substring(0, 8) + 'T' + classItem.startTime.replace(':', '') + '00'
    const endDateTime = dateString.substring(0, 8) + 'T' + classItem.endTime.replace(':', '') + '00'
    
    icalContent = icalContent.concat([
      'BEGIN:VEVENT',
      `SUMMARY:${classItem.code} - ${classItem.name}`,
      `LOCATION:${classItem.classroom}`,
      `DESCRIPTION:Şube: ${classItem.section}`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `UID:${classItem.id}@teacherattendance.com`,
      'END:VEVENT'
    ])
  })
  
  icalContent.push('END:VCALENDAR')
  
  return icalContent.join('\r\n')
}

/**
 * Saves schedule data to localStorage
 * @param {String} userId - User ID
 * @param {Object} schedule - Schedule data
 */
export const saveScheduleToStorage = (userId, schedule) => {
  try {
    localStorage.setItem(`schedule_${userId}`, JSON.stringify(schedule))
    return true
  } catch (error) {
    console.error('Error saving schedule to storage:', error)
    return false
  }
}

/**
 * Loads schedule data from localStorage
 * @param {String} userId - User ID
 * @returns {Object|null} - Schedule data or null if not found
 */
export const loadScheduleFromStorage = (userId) => {
  try {
    const scheduleData = localStorage.getItem(`schedule_${userId}`)
    return scheduleData ? JSON.parse(scheduleData) : null
  } catch (error) {
    console.error('Error loading schedule from storage:', error)
    return null
  }
}