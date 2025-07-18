import api from './api'

export const attendanceService = {
  // Start attendance session
  async startSession(courseId, sessionType = 'regular') {
    try {
      const response = await api.post(`/attendance/sessions/start`, {
        courseId,
        sessionType
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // End attendance session
  async endSession(sessionId) {
    try {
      const response = await api.post(`/attendance/sessions/${sessionId}/end`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get QR token for session
  async getQRToken(sessionId) {
    try {
      const response = await api.get(`/attendance/sessions/${sessionId}/qr-token`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get attendance list for a course
  async getAttendanceList(courseId, filters = {}) {
    try {
      const params = new URLSearchParams(filters)
      const response = await api.get(`/attendance/courses/${courseId}?${params}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get attendance for specific session
  async getSessionAttendance(sessionId) {
    try {
      const response = await api.get(`/attendance/sessions/${sessionId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Mark student attendance manually
  async markAttendance(sessionId, studentId, status) {
    try {
      const response = await api.post(`/attendance/sessions/${sessionId}/mark`, {
        studentId,
        status // 'present', 'absent', 'excused'
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Bulk mark attendance
  async bulkMarkAttendance(sessionId, attendanceData) {
    try {
      const response = await api.post(`/attendance/sessions/${sessionId}/bulk-mark`, {
        attendanceData
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Export attendance data
  async exportAttendance(courseId, format = 'pdf', filters = {}) {
    try {
      const params = new URLSearchParams({ ...filters, format })
      const response = await api.get(`/attendance/courses/${courseId}/export?${params}`, {
        responseType: 'blob',
      })
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      const filename = `attendance_${courseId}_${new Date().toISOString().split('T')[0]}.${format}`
      link.setAttribute('download', filename)
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      throw error
    }
  },

  // Get attendance statistics
  async getAttendanceStats(courseId, filters = {}) {
    try {
      const params = new URLSearchParams(filters)
      const response = await api.get(`/attendance/courses/${courseId}/stats?${params}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get attendance history for a student
  async getStudentAttendanceHistory(courseId, studentId) {
    try {
      const response = await api.get(`/attendance/courses/${courseId}/students/${studentId}/history`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update attendance record
  async updateAttendanceRecord(recordId, status) {
    try {
      const response = await api.put(`/attendance/records/${recordId}`, { status })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete attendance session
  async deleteSession(sessionId) {
    try {
      const response = await api.delete(`/attendance/sessions/${sessionId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}