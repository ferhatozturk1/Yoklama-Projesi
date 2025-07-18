// Schedule management utilities

export const extendScheduleTo15Weeks = (weeklySchedule, startDate = new Date()) => {
  const extendedSchedule = {}
  const weeks = 15
  
  // Get the start of the semester (Monday of the first week)
  const semesterStart = new Date(startDate)
  const dayOfWeek = semesterStart.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  semesterStart.setDate(semesterStart.getDate() + mondayOffset)
  
  for (let week = 0; week < weeks; week++) {
    const weekKey = `week-${week + 1}`
    extendedSchedule[weekKey] = {
      weekNumber: week + 1,
      startDate: new Date(semesterStart.getTime() + (week * 7 * 24 * 60 * 60 * 1000)),
      schedule: { ...weeklySchedule }
    }
  }
  
  return extendedSchedule
}

export const saveScheduleToStorage = (schedule) => {
  try {
    localStorage.setItem('weeklySchedule', JSON.stringify(schedule))
    return true
  } catch (error) {
    console.error('Failed to save schedule:', error)
    return false
  }
}

export const loadScheduleFromStorage = () => {
  try {
    const saved = localStorage.getItem('weeklySchedule')
    return saved ? JSON.parse(saved) : {}
  } catch (error) {
    console.error('Failed to load schedule:', error)
    return {}
  }
}

export const exportScheduleToJSON = (schedule) => {
  const dataStr = JSON.stringify(schedule, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  
  const exportFileDefaultName = `schedule_${new Date().toISOString().split('T')[0]}.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

export const importScheduleFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const schedule = JSON.parse(e.target.result)
        resolve(schedule)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export const validateSchedule = (schedule) => {
  const errors = []
  
  Object.keys(schedule).forEach(day => {
    Object.keys(schedule[day]).forEach(timeSlot => {
      const course = schedule[day][timeSlot]
      
      if (!course.code) {
        errors.push(`${day} ${timeSlot}: Ders kodu eksik`)
      }
      
      if (!course.classroom) {
        errors.push(`${day} ${timeSlot}: Derslik bilgisi eksik`)
      }
      
      if (!course.section) {
        errors.push(`${day} ${timeSlot}: Şube bilgisi eksik`)
      }
    })
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const detectScheduleConflicts = (schedule) => {
  const conflicts = []
  
  Object.keys(schedule).forEach(day => {
    const timeSlots = Object.keys(schedule[day]).sort()
    
    for (let i = 0; i < timeSlots.length - 1; i++) {
      const currentSlot = timeSlots[i]
      const nextSlot = timeSlots[i + 1]
      
      const currentEnd = currentSlot.split('-')[1] || currentSlot
      const nextStart = nextSlot.split('-')[0] || nextSlot
      
      if (currentEnd > nextStart) {
        conflicts.push({
          day,
          conflict: `${currentSlot} ve ${nextSlot} çakışıyor`,
          courses: [schedule[day][currentSlot], schedule[day][nextSlot]]
        })
      }
    }
  })
  
  return conflicts
}

export const generateScheduleSummary = (schedule) => {
  let totalCourses = 0
  let totalHours = 0
  const coursesByDay = {}
  const uniqueCourses = new Set()
  
  Object.keys(schedule).forEach(day => {
    coursesByDay[day] = Object.keys(schedule[day]).length
    totalCourses += coursesByDay[day]
    
    Object.values(schedule[day]).forEach(course => {
      uniqueCourses.add(course.code)
      // Assume each slot is 1 hour for simplicity
      totalHours += 1
    })
  })
  
  return {
    totalCourses,
    totalHours,
    uniqueCourses: uniqueCourses.size,
    coursesByDay,
    busiestDay: Object.keys(coursesByDay).reduce((a, b) => 
      coursesByDay[a] > coursesByDay[b] ? a : b
    )
  }
}