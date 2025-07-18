import api from './api'

export const courseService = {
  // Get all courses for the current user
  async getCourses() {
    try {
      const response = await api.get('/courses')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get course by ID
  async getCourseById(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Create new course
  async createCourse(courseData) {
    try {
      const response = await api.post('/courses', courseData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update course
  async updateCourse(courseId, courseData) {
    try {
      const response = await api.put(`/courses/${courseId}`, courseData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete course
  async deleteCourse(courseId) {
    try {
      const response = await api.delete(`/courses/${courseId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Upload student list for a course
  async uploadStudentList(courseId, file) {
    try {
      const formData = new FormData()
      formData.append('studentList', file)
      
      const response = await api.post(`/courses/${courseId}/students/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get students for a course
  async getCourseStudents(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}/students`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Add student to course manually
  async addStudent(courseId, studentData) {
    try {
      const response = await api.post(`/courses/${courseId}/students`, studentData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update student information
  async updateStudent(courseId, studentId, studentData) {
    try {
      const response = await api.put(`/courses/${courseId}/students/${studentId}`, studentData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Remove student from course
  async removeStudent(courseId, studentId) {
    try {
      const response = await api.delete(`/courses/${courseId}/students/${studentId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get course schedule
  async getCourseSchedule(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}/schedule`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update course schedule
  async updateCourseSchedule(courseId, scheduleData) {
    try {
      const response = await api.put(`/courses/${courseId}/schedule`, scheduleData)
      return response.data
    } catch (error) {
      throw error
    }
  }
}