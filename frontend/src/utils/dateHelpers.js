import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns'

// Format date for display
export const formatDate = (date, formatString = 'dd MMMM yyyy') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

// Format time for display
export const formatTime = (date, formatString = 'HH:mm') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

// Format datetime for display
export const formatDateTime = (date, formatString = 'dd MMMM yyyy HH:mm') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

// Get greeting based on time of day
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours()
  
  if (hour < 12) {
    return 'Günaydın'
  } else if (hour < 18) {
    return 'İyi günler'
  } else {
    return 'İyi akşamlar'
  }
}

// Get motivational message
export const getMotivationalMessage = () => {
  const messages = [
    'Bugün nasılsın?',
    'Bugün güzel bir güne benziyor',
    'Harika bir gün seni bekliyor',
    'Bugün yeni başarılar için mükemmel bir gün',
    'Enerjin yüksek görünüyor bugün',
    'Bugün öğrencilerinle güzel anlar geçireceksin'
  ]
  
  return messages[Math.floor(Math.random() * messages.length)]
}

// Check if date is a holiday
export const isHoliday = (date, holidays = []) => {
  if (!date || !holidays.length) return false
  
  const checkDate = startOfDay(typeof date === 'string' ? parseISO(date) : date)
  
  return holidays.some(holiday => {
    const holidayDate = startOfDay(parseISO(holiday.date))
    return checkDate.getTime() === holidayDate.getTime()
  })
}

// Check if date is in exam period
export const isExamWeek = (date, examPeriods = []) => {
  if (!date || !examPeriods.length) return false
  
  const checkDate = typeof date === 'string' ? parseISO(date) : date
  
  return examPeriods.some(period => {
    try {
      return isWithinInterval(checkDate, {
        start: parseISO(period.startDate),
        end: parseISO(period.endDate)
      })
    } catch (error) {
      console.error('Error checking exam period:', error)
      return false
    }
  })
}

// Check if date is within academic period
export const isAcademicPeriod = (date, semesterDates) => {
  if (!date || !semesterDates?.startDate || !semesterDates?.endDate) return true
  
  const checkDate = typeof date === 'string' ? parseISO(date) : date
  
  try {
    return isWithinInterval(checkDate, {
      start: parseISO(semesterDates.startDate),
      end: parseISO(semesterDates.endDate)
    })
  } catch (error) {
    console.error('Error checking academic period:', error)
    return true // Default to allowing if there's an error
  }
}

// Check if current time is within class hours
export const isClassTime = (classSchedule, currentTime = new Date()) => {
  if (!classSchedule?.startTime || !classSchedule?.endTime) return false
  
  const now = format(currentTime, 'HH:mm')
  const startTime = classSchedule.startTime
  const endTime = classSchedule.endTime
  
  return now >= startTime && now <= endTime
}

// Get day name in Turkish
export const getDayName = (date) => {
  const days = [
    'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 
    'Perşembe', 'Cuma', 'Cumartesi'
  ]
  const dayIndex = (typeof date === 'string' ? parseISO(date) : date).getDay()
  return days[dayIndex]
}

// Get week days for schedule
export const getWeekDays = () => {
  return [
    { key: 'monday', name: 'Pazartesi', short: 'Pzt' },
    { key: 'tuesday', name: 'Salı', short: 'Sal' },
    { key: 'wednesday', name: 'Çarşamba', short: 'Çar' },
    { key: 'thursday', name: 'Perşembe', short: 'Per' },
    { key: 'friday', name: 'Cuma', short: 'Cum' }
  ]
}

// Generate time slots for schedule
export const generateTimeSlots = (startHour = 8, endHour = 18, interval = 60) => {
  const slots = []
  
  for (let hour = startHour; hour < endHour; hour++) {
    const timeSlot = {
      start: `${hour.toString().padStart(2, '0')}:00`,
      end: `${(hour + 1).toString().padStart(2, '0')}:00`,
      label: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`
    }
    slots.push(timeSlot)
  }
  
  return slots
}

// Calculate attendance percentage
export const calculateAttendancePercentage = (presentCount, totalSessions) => {
  if (totalSessions === 0) return 0
  return Math.round((presentCount / totalSessions) * 100)
}

// Get attendance status color
export const getAttendanceStatusColor = (status) => {
  const colors = {
    present: '#10b981', // green
    absent: '#ef4444',  // red
    excused: '#f59e0b', // yellow
    late: '#8b5cf6'     // purple
  }
  
  return colors[status] || '#64748b' // default gray
}

// Validate date range
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false
  
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  
  return start <= end
}