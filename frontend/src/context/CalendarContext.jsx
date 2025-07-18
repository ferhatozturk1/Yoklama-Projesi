import React, { createContext, useContext, useState, useEffect } from 'react'
import { calendarService } from '../services/calendarService'
import { isHoliday, isExamWeek, isAcademicPeriod } from '../utils/dateHelpers'

const CalendarContext = createContext({})

export const useCalendar = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}

export const CalendarProvider = ({ children }) => {
  const [academicCalendar, setAcademicCalendar] = useState(null)
  const [holidays, setHolidays] = useState([
    {
      id: '1',
      name: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı',
      date: '2024-04-23',
      type: 'national'
    },
    {
      id: '2',
      name: '1 Mayıs İşçi Bayramı',
      date: '2024-05-01',
      type: 'national'
    },
    {
      id: '3',
      name: '19 Mayıs Atatürk\'ü Anma Gençlik ve Spor Bayramı',
      date: '2024-05-19',
      type: 'national'
    },
    {
      id: '4',
      name: '29 Ekim Cumhuriyet Bayramı',
      date: '2024-10-29',
      type: 'national'
    }
  ])
  const [examPeriods, setExamPeriods] = useState([
    {
      id: '1',
      name: 'Ara Sınav Dönemi',
      startDate: '2024-11-04',
      endDate: '2024-11-15',
      type: 'midterm'
    },
    {
      id: '2',
      name: 'Final Sınav Dönemi',
      startDate: '2024-12-16',
      endDate: '2024-12-27',
      type: 'final'
    }
  ])
  const [semesterDates, setSemesterDates] = useState({
    startDate: '2024-09-16',
    endDate: '2025-01-31'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // In demo mode, we already have the data loaded
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      setLoading(false)
    } else {
      loadAcademicCalendar()
    }
  }, [])

  const loadAcademicCalendar = async () => {
    try {
      setLoading(true)
      const calendarData = await calendarService.getAcademicCalendar()
      
      setAcademicCalendar(calendarData)
      setHolidays(calendarData.holidays || [])
      setExamPeriods(calendarData.examPeriods || [])
      setSemesterDates({
        startDate: calendarData.semesterStart,
        endDate: calendarData.semesterEnd
      })
    } catch (error) {
      console.error('Failed to load academic calendar:', error)
      // Set default values or show error
      setHolidays([])
      setExamPeriods([])
    } finally {
      setLoading(false)
    }
  }

  const canStartClass = (date = new Date()) => {
    // Check if it's a holiday
    if (isHoliday(date, holidays)) {
      return {
        allowed: false,
        reason: 'Bugün resmi tatil, yoklama başlatılamaz.'
      }
    }

    // Check if it's exam week
    if (isExamWeek(date, examPeriods)) {
      return {
        allowed: false,
        reason: 'Sınav haftası, normal ders yoklaması başlatılamaz.'
      }
    }

    // Check if it's within academic period
    if (!isAcademicPeriod(date, semesterDates)) {
      return {
        allowed: false,
        reason: 'Akademik takvim dışı dönem, yoklama başlatılamaz.'
      }
    }

    return {
      allowed: true,
      reason: null
    }
  }

  const getDateStatus = (date) => {
    if (isHoliday(date, holidays)) {
      const holiday = holidays.find(h => 
        new Date(h.date).toDateString() === date.toDateString()
      )
      return {
        type: 'holiday',
        message: holiday?.name || 'Resmi Tatil'
      }
    }

    if (isExamWeek(date, examPeriods)) {
      return {
        type: 'exam',
        message: 'Sınav Haftası'
      }
    }

    if (!isAcademicPeriod(date, semesterDates)) {
      return {
        type: 'non-academic',
        message: 'Akademik Takvim Dışı'
      }
    }

    return {
      type: 'normal',
      message: null
    }
  }

  const refreshCalendar = () => {
    loadAcademicCalendar()
  }

  // Add a holiday
  const addHoliday = async (holidayData) => {
    try {
      setLoading(true)
      
      // In demo mode, just add to the state
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        const newHoliday = {
          id: Date.now().toString(),
          ...holidayData
        }
        setHolidays([...holidays, newHoliday])
        return newHoliday
      }
      
      // In production mode, call the API
      const response = await calendarService.addHoliday(holidayData)
      setHolidays([...holidays, response])
      return response
    } catch (error) {
      console.error('Failed to add holiday:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  // Remove a holiday
  const removeHoliday = async (holidayId) => {
    try {
      setLoading(true)
      
      // In demo mode, just remove from the state
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        setHolidays(holidays.filter(h => h.id !== holidayId))
        return { success: true }
      }
      
      // In production mode, call the API
      await calendarService.deleteHoliday(holidayId)
      setHolidays(holidays.filter(h => h.id !== holidayId))
      return { success: true }
    } catch (error) {
      console.error('Failed to remove holiday:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  // Add an exam period
  const addExamPeriod = async (examPeriodData) => {
    try {
      setLoading(true)
      
      // In demo mode, just add to the state
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        const newExamPeriod = {
          id: Date.now().toString(),
          ...examPeriodData
        }
        setExamPeriods([...examPeriods, newExamPeriod])
        return newExamPeriod
      }
      
      // In production mode, call the API
      const response = await calendarService.addExamPeriod(examPeriodData)
      setExamPeriods([...examPeriods, response])
      return response
    } catch (error) {
      console.error('Failed to add exam period:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  // Remove an exam period
  const removeExamPeriod = async (examPeriodId) => {
    try {
      setLoading(true)
      
      // In demo mode, just remove from the state
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        setExamPeriods(examPeriods.filter(e => e.id !== examPeriodId))
        return { success: true }
      }
      
      // In production mode, call the API
      await calendarService.deleteExamPeriod(examPeriodId)
      setExamPeriods(examPeriods.filter(e => e.id !== examPeriodId))
      return { success: true }
    } catch (error) {
      console.error('Failed to remove exam period:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  // Update semester dates
  const updateSemesterDates = async (newDates) => {
    try {
      setLoading(true)
      
      // In demo mode, just update the state
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        setSemesterDates(newDates)
        return { success: true }
      }
      
      // In production mode, call the API
      await calendarService.updateAcademicCalendar({
        semesterStart: newDates.startDate,
        semesterEnd: newDates.endDate
      })
      setSemesterDates(newDates)
      return { success: true }
    } catch (error) {
      console.error('Failed to update semester dates:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  // Get upcoming events (holidays and exam periods)
  const getUpcomingEvents = (count = 3) => {
    const today = new Date()
    
    // Combine holidays and exam periods
    const allEvents = [
      ...holidays.map(h => ({
        ...h,
        eventDate: new Date(h.date),
        eventType: 'holiday'
      })),
      ...examPeriods.map(e => ({
        ...e,
        eventDate: new Date(e.startDate),
        eventType: 'exam'
      }))
    ]
    
    // Filter future events and sort by date
    return allEvents
      .filter(event => event.eventDate >= today)
      .sort((a, b) => a.eventDate - b.eventDate)
      .slice(0, count)
  }

  const value = {
    academicCalendar,
    holidays,
    examPeriods,
    semesterDates,
    loading,
    canStartClass,
    getDateStatus,
    refreshCalendar,
    addHoliday,
    removeHoliday,
    addExamPeriod,
    removeExamPeriod,
    updateSemesterDates,
    getUpcomingEvents
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}