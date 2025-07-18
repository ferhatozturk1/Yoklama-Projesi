import api from './api'

export const calendarService = {
  // Get academic calendar
  async getAcademicCalendar() {
    try {
      const response = await api.get('/calendar/academic')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get holidays
  async getHolidays() {
    try {
      const response = await api.get('/calendar/holidays')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get exam periods
  async getExamPeriods() {
    try {
      const response = await api.get('/calendar/exam-periods')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update academic calendar (admin only)
  async updateAcademicCalendar(calendarData) {
    try {
      const response = await api.put('/calendar/academic', calendarData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Add holiday
  async addHoliday(holidayData) {
    try {
      const response = await api.post('/calendar/holidays', holidayData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update holiday
  async updateHoliday(holidayId, holidayData) {
    try {
      const response = await api.put(`/calendar/holidays/${holidayId}`, holidayData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete holiday
  async deleteHoliday(holidayId) {
    try {
      const response = await api.delete(`/calendar/holidays/${holidayId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Add exam period
  async addExamPeriod(examPeriodData) {
    try {
      const response = await api.post('/calendar/exam-periods', examPeriodData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update exam period
  async updateExamPeriod(examPeriodId, examPeriodData) {
    try {
      const response = await api.put(`/calendar/exam-periods/${examPeriodId}`, examPeriodData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete exam period
  async deleteExamPeriod(examPeriodId) {
    try {
      const response = await api.delete(`/calendar/exam-periods/${examPeriodId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Check if date is valid for class
  async validateClassDate(date, courseId) {
    try {
      const response = await api.post('/calendar/validate-class-date', {
        date,
        courseId
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}