import api from './api'

export const userService = {
  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/user/profile')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/user/profile', profileData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Upload profile photo
  async uploadPhoto(file) {
    try {
      const formData = new FormData()
      formData.append('photo', file)
      
      const response = await api.post('/user/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Upload academic calendar
  async uploadAcademicCalendar(file) {
    try {
      const formData = new FormData()
      formData.append('calendar', file)
      
      const response = await api.post('/user/upload-calendar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Generate and download profile PDF
  async downloadProfilePDF() {
    try {
      const response = await api.get('/user/profile-pdf', {
        responseType: 'blob',
      })
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'profile.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      throw error
    }
  },

  // Delete user account
  async deleteAccount() {
    try {
      const response = await api.delete('/user/account')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/user/change-password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}