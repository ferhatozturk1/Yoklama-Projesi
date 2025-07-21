import apiClient from '../utils/apiClient'

/**
 * Attendance service for handling attendance operations
 */
const attendanceService = {
  /**
   * Start attendance session
   * @param {string} courseId - Course ID
   * @param {Object} sessionData - Session data
   * @returns {Promise<Object>} - Created session
   */
  startSession: async (courseId, sessionData) => {
    const response = await apiClient.post(`/courses/${courseId}/attendance/start`, sessionData)
    return response.data
  },
  
  /**
   * End attendance session
   * @param {string} courseId - Course ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} - Session data
   */
  endSession: async (courseId, sessionId) => {
    const response = await apiClient.post(`/courses/${courseId}/attendance/${sessionId}/end`)
    return response.data
  },
  
  /**
   * Get active session
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Active session data
   */
  getActiveSession: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/attendance/active`)
    return response.data
  },
  
  /**
   * Get session by ID
   * @param {string} courseId - Course ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} - Session data
   */
  getSession: async (courseId, sessionId) => {
    const response = await apiClient.get(`/courses/${courseId}/attendance/${sessionId}`)
    return response.data
  },
  
  /**
   * Get all sessions for a course
   * @param {string} courseId - Course ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} - List of sessions
   */
  getSessions: async (courseId, params = {}) => {
    const response = await apiClient.get(`/courses/${courseId}/attendance`, { params })
    return response.data
  },
  
  /**
   * Update attendance for a session
   * @param {string} courseId - Course ID
   * @param {string} sessionId - Session ID
   * @param {Array} attendanceData - Attendance data
   * @returns {Promise<Object>} - Updated session
   */
  updateAttendance: async (courseId, sessionId, attendanceData) => {
    const response = await apiClient.put(
      `/courses/${courseId}/attendance/${sessionId}`,
      { attendances: attendanceData }
    )
    return response.data
  },
  
  /**
   * Mark student attendance
   * @param {string} courseId - Course ID
   * @param {string} sessionId - Session ID
   * @param {string} studentId - Student ID
   * @param {string} status - Attendance status (present, absent, excused)
   * @returns {Promise<Object>} - Updated attendance record
   */
  markAttendance: async (courseId, sessionId, studentId, status) => {
    const response = await apiClient.put(
      `/courses/${courseId}/attendance/${sessionId}/students/${studentId}`,
      { status }
    )
    return response.data
  },
  
  /**
   * Bulk update attendance
   * @param {string} courseId - Course ID
   * @param {string} sessionId - Session ID
   * @param {string} status - Attendance status (present, absent, excused)
   * @param {Array} studentIds - List of student IDs
   * @returns {Promise<Object>} - Updated session
   */
  bulkUpdateAttendance: async (courseId, sessionId, status, studentIds) => {
    const response = await apiClient.put(
      `/courses/${courseId}/attendance/${sessionId}/bulk`,
      { status, studentIds }
    )
    return response.data
  },
  
  /**
   * Generate QR code for attendance
   * @param {string} courseId - Course ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} - QR code data
   */
  generateQRCode: async (courseId, sessionId) => {
    const response = await apiClient.get(
      `/courses/${courseId}/attendance/${sessionId}/qr`,
      { responseType: 'blob' }
    )
    return response.data
  },
  
  /**
   * Get attendance statistics
   * @param {string} courseId - Course ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Attendance statistics
   */
  getAttendanceStatistics: async (courseId, params = {}) => {
    const response = await apiClient.get(
      `/courses/${courseId}/attendance/statistics`,
      { params }
    )
    return response.data
  },
  
  /**
   * Get student attendance history
   * @param {string} courseId - Course ID
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} - Attendance history
   */
  getStudentAttendance: async (courseId, studentId) => {
    const response = await apiClient.get(
      `/courses/${courseId}/students/${studentId}/attendance`
    )
    return response.data
  },
  
  /**
   * Export attendance data
   * @param {string} courseId - Course ID
   * @param {string} format - Export format (pdf, excel)
   * @param {Object} params - Query parameters
   * @returns {Promise<Blob>} - Exported file blob
   */
  exportAttendance: async (courseId, format = 'pdf', params = {}) => {
    const response = await apiClient.get(
      `/courses/${courseId}/attendance/export/${format}`,
      {
        params,
        responseType: 'blob'
      }
    )
    return response.data
  },
  
  /**
   * Check if attendance can be started
   * @param {string} courseId - Course ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Validation result
   */
  validateAttendanceStart: async (courseId, params = {}) => {
    const response = await apiClient.post(
      `/courses/${courseId}/attendance/validate`,
      params
    )
    return response.data
  }
}

export default attendanceService