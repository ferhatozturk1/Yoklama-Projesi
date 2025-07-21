/**
 * Services index file
 * 
 * This file exports all API service modules for easy importing.
 */

// Authentication and user services
export { default as authService } from './authService'
export { default as userService } from './userService'

// Course and attendance services
export { default as courseService } from './courseService'
export { default as attendanceService } from './attendanceService'

// Export all services as a single object
export default {
  auth: require('./authService').default,
  user: require('./userService').default,
  course: require('./courseService').default,
  attendance: require('./attendanceService').default
}