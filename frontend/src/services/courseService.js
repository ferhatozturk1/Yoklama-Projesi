import apiClient from '../utils/apiClient'

/**
 * Course service for handling course operations
 */
const courseService = {
  /**
   * Get all courses
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} - List of courses
   */
  getCourses: async (params = {}) => {
    const response = await apiClient.get('/courses', { params })
    return response.data
  },
  
  /**
   * Get course by ID
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Course data
   */
  getCourse: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}`)
    return response.data
  },
  
  /**
   * Create new course
   * @param {Object} courseData - Course data
   * @returns {Promise<Object>} - Created course
   */
  createCourse: async (courseData) => {
    const response = await apiClient.post('/courses', courseData)
    return response.data
  },
  
  /**
   * Update course
   * @param {string} courseId - Course ID
   * @param {Object} courseData - Course data to update
   * @returns {Promise<Object>} - Updated course
   */
  updateCourse: async (courseId, courseData) => {
    const response = await apiClient.put(`/courses/${courseId}`, courseData)
    return response.data
  },
  
  /**
   * Delete course
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Response data
   */
  deleteCourse: async (courseId) => {
    const response = await apiClient.delete(`/courses/${courseId}`)
    return response.data
  },
  
  /**
   * Get course students
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} - List of students
   */
  getCourseStudents: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/students`)
    return response.data
  },
  
  /**
   * Add student to course
   * @param {string} courseId - Course ID
   * @param {Object} studentData - Student data
   * @returns {Promise<Object>} - Added student
   */
  addStudent: async (courseId, studentData) => {
    const response = await apiClient.post(`/courses/${courseId}/students`, studentData)
    return response.data
  },
  
  /**
   * Update student in course
   * @param {string} courseId - Course ID
   * @param {string} studentId - Student ID
   * @param {Object} studentData - Student data to update
   * @returns {Promise<Object>} - Updated student
   */
  updateStudent: async (courseId, studentId, studentData) => {
    const response = await apiClient.put(`/courses/${courseId}/students/${studentId}`, studentData)
    return response.data
  },
  
  /**
   * Delete student from course
   * @param {string} courseId - Course ID
   * @param {string} studentId - Student ID
   * @returns {Promise<Object>} - Response data
   */
  deleteStudent: async (courseId, studentId) => {
    const response = await apiClient.delete(`/courses/${courseId}/students/${studentId}`)
    return response.data
  },
  
  /**
   * Upload student list
   * @param {string} courseId - Course ID
   * @param {File} file - Student list file (.xlsx or .csv)
   * @returns {Promise<Object>} - Upload result
   */
  uploadStudentList: async (courseId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post(`/courses/${courseId}/students/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  },
  
  /**
   * Get course schedule
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Course schedule
   */
  getCourseSchedule: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/schedule`)
    return response.data
  },
  
  /**
   * Update course schedule
   * @param {string} courseId - Course ID
   * @param {Object} scheduleData - Schedule data
   * @returns {Promise<Object>} - Updated schedule
   */
  updateCourseSchedule: async (courseId, scheduleData) => {
    const response = await apiClient.put(`/courses/${courseId}/schedule`, scheduleData)
    return response.data
  },
  
  /**
   * Get weekly schedule for all courses
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Weekly schedule
   */
  getWeeklySchedule: async (params = {}) => {
    const response = await apiClient.get('/courses/schedule', { params })
    return response.data
  },
  
  /**
   * Extend weekly schedule to semester
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Semester schedule
   */
  extendScheduleToSemester: async (params = {}) => {
    const response = await apiClient.post('/courses/schedule/extend', params)
    return response.data
  },
  
  /**
   * Get course statistics
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Course statistics
   */
  getCourseStatistics: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/statistics`)
    return response.data
  },
  
  /**
   * Get dashboard summary
   * @returns {Promise<Object>} - Dashboard summary data
   */
  getDashboardSummary: async () => {
    const response = await apiClient.get('/courses/dashboard')
    return response.data
  }
}

export default courseService