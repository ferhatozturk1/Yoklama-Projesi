import apiClient from '../utils/apiClient'

/**
 * User service for handling user profile operations
 */
const userService = {
  /**
   * Get user profile
   * @param {string} userId - User ID (optional, defaults to current user)
   * @returns {Promise<Object>} - User profile data
   */
  getProfile: async (userId = 'me') => {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  },
  
  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Updated user profile
   */
  updateProfile: async (profileData) => {
    // Handle file uploads with FormData
    if (profileData.profilePhoto instanceof File) {
      const formData = new FormData()
      
      // Add profile data to form data
      Object.keys(profileData).forEach(key => {
        if (key === 'profilePhoto') {
          formData.append(key, profileData[key])
        } else {
          formData.append(key, profileData[key])
        }
      })
      
      const response = await apiClient.put('/users/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    }
    
    // Regular JSON update
    const response = await apiClient.put('/users/me', profileData)
    return response.data
  },
  
  /**
   * Upload profile photo
   * @param {File} file - Photo file
   * @returns {Promise<Object>} - Updated user profile
   */
  uploadProfilePhoto: async (file) => {
    const formData = new FormData()
    formData.append('profilePhoto', file)
    
    const response = await apiClient.post('/users/me/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  },
  
  /**
   * Upload academic calendar
   * @param {File} file - Calendar file
   * @returns {Promise<Object>} - Updated user profile
   */
  uploadAcademicCalendar: async (file) => {
    const formData = new FormData()
    formData.append('academicCalendar', file)
    
    const response = await apiClient.post('/users/me/calendar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  },
  
  /**
   * Get academic calendar
   * @returns {Promise<Object>} - Academic calendar data
   */
  getAcademicCalendar: async () => {
    const response = await apiClient.get('/users/me/calendar')
    return response.data
  },
  
  /**
   * Update academic calendar
   * @param {Object} calendarData - Calendar data
   * @returns {Promise<Object>} - Updated calendar data
   */
  updateAcademicCalendar: async (calendarData) => {
    const response = await apiClient.put('/users/me/calendar', calendarData)
    return response.data
  },
  
  /**
   * Generate profile PDF
   * @returns {Promise<Blob>} - PDF file blob
   */
  generateProfilePDF: async () => {
    const response = await apiClient.get('/users/me/pdf', {
      responseType: 'blob'
    })
    
    return response.data
  },
  
  /**
   * Get user notification settings
   * @returns {Promise<Object>} - Notification settings
   */
  getNotificationSettings: async () => {
    const response = await apiClient.get('/users/me/notifications')
    return response.data
  },
  
  /**
   * Update user notification settings
   * @param {Object} settings - Notification settings
   * @returns {Promise<Object>} - Updated notification settings
   */
  updateNotificationSettings: async (settings) => {
    const response = await apiClient.put('/users/me/notifications', settings)
    return response.data
  }
}

export default userService